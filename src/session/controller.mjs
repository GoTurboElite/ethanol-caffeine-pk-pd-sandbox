import {V15_VERSION,V15_PROJECT_SCHEMA,V15_PROJECT_SCHEMA_VERSION,V15_MAX_PROJECT_BYTES,V15History,v15Clone,v15Stable,v15SafeParse,v15Id,v15NormalizeMarkers,v15ValidateZone,v15HistoryLabel,v15ShiftFrame,v15Reanchor} from './core.mjs';
import {V15Storage} from './storage.mjs';
import {emptyScience,validateScience} from '../science/schema.mjs';
import {acceptedState,portableInspection} from './accepted.mjs';
export const V15_TIME_FIELDS=['scenarioAnchorInstant','scenarioTimeZone','timeDisplayMode','timeReferenceBasis','selectedTimeH','selectedTimeProvenance','selectedLandmarkId','followNow'];
export class V15Controller {
 constructor(bridge,environment=globalThis){
  this.bridge=bridge;this.env=environment;this.store=bridge.store;this.storage=new V15Storage(environment);
  this.markers=[];this.listeners=new Set();this.revision=0;this.suppress=0;this.timer=null;this.writeSerial=0;this.writeChain=Promise.resolve();
  this.importedHistory=[];this.projects=[];this.recovery=null;this.recoveryEnabled=false;this.storageStatus='opening';this.message='';this.comparison=null;this.comparisonKey=null;this.comparisonSerial=0;
  this.scienceDocument=emptyScience();this.history=new V15History(this.capture());this.installHistory();this.ready=this.initialise();
 }
 subscribe=listener=>{this.listeners.add(listener);return()=>this.listeners.delete(listener);};
 getRevision=()=>this.revision;
 emit(){this.revision++;for(const fn of this.listeners)fn();}
 capture(){
  const s=this.store.state,p={};for(const key of V15_TIME_FIELDS)p[key]=s.presentation[key]??null;
  return {document:v15Clone(s.document),presentation:p,markers:v15Clone(this.markers),science:v15Clone(this.scienceDocument)};
 }
 installHistory(){
  const store=this.store,originalField=store.field.bind(store),originalTransaction=store.transaction.bind(store);
  store.field=(name,update)=>{
   const track=!this.suppress&&!store.depth,before=track?this.capture():null;
   const answer=originalField(name,update);
   if(track){
    const after=this.capture(),documentChanged=v15Stable(before.document)!==v15Stable(after.document),
      clockChanged=['scenarioAnchorInstant','scenarioTimeZone'].some(k=>before.presentation[k]!==after.presentation[k]);
    if(documentChanged||clockChanged){this.history.push(after,clockChanged?'Changed calendar anchor or time zone':v15HistoryLabel(name));this.changed();}
   }
   return answer;
  };
  store.transaction=(label,fn)=>{
   const track=!this.suppress&&!store.depth,before=track?this.capture():null;
   const answer=originalTransaction(label,fn);
   if(track&&v15Stable(before)!==v15Stable(this.capture())){this.history.push(this.capture(),v15HistoryLabel(label));this.changed();}
   return answer;
  };
 }
 changed(){
  const key=v15Stable(this.comparisonInput());
  if(!this.store.state.document.comparisonEnabled||(this.comparisonKey&&this.comparisonKey!==key)){
   this.comparisonSerial++;this.comparison=null;this.comparisonKey=null;
   if(this.comparisonRequest)for(const side of ['A','B'])this.bridge.runtime.cancelRequest(this.comparisonRequest+'-'+side,'superseded');
  }
  this.scheduleRecovery();this.emit();
 }
 async initialise(){
  try{
   const records=await this.storage.list();this.projects=records.filter(x=>x.kind==='project').sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
   this.recovery=records.find(x=>x.id==='recovery')??null;this.recoveryEnabled=records.find(x=>x.id==='preferences')?.recoveryEnabled===true;this.storageStatus='ready';
   let restore=false;try{restore=this.env.sessionStorage?.getItem('pkpd-v15-update-restore')==='1';this.env.sessionStorage?.removeItem('pkpd-v15-update-restore');}catch{}
   if(restore&&this.recovery){this.importObject(this.recovery.project,'Restored session after application update');this.message='The saved session was restored after the application update.';}
  }catch(error){this.storageStatus='failed';this.message=error.message;}
  this.emit();
 }
 canSave(){return this.store.state.draft?.validation?.status==='valid'&&!this.store.state.editingInvalidCount;}
 validateFrame(frame,allowInvalid=false,inspectionHorizon=frame.document.mainScenario.subject.simulationDurationH){
  if(!frame?.document?.mainScenario||typeof frame.document.title!=='string'||typeof frame.document.notes!=='string')throw Error('The session document is incomplete.');
  if(frame.document.title.length>500||frame.document.notes.length>20000)throw Error('The session title or notes exceed the supported length.');
  const valid=this.bridge.validate(frame.document.mainScenario);
  if(!allowInvalid&&valid.status!=='valid')throw Error('Scenario validation failed: '+(valid.messages??[]).map(x=>typeof x==='string'?x:x.message??JSON.stringify(x)).join(' '));
  if(!frame.document.comparisonScenarios?.A||!frame.document.comparisonScenarios?.B)throw Error('Comparison state is missing.');
  if(!allowInvalid&&frame.document.comparisonEnabled)for(const key of ['A','B'])if(this.bridge.validate(frame.document.comparisonScenarios[key]).status!=='valid')throw Error('Comparison '+key+' has invalid inputs.');
  if(!frame.document.behaviourProfile||!frame.document.comparisonBehaviourProfiles)throw Error('Behavioural profile state is missing.');
  for(const profile of [frame.document.behaviourProfile,frame.document.comparisonBehaviourProfiles.A,frame.document.comparisonBehaviourProfiles.B]){
   if(!profile||typeof profile.applied!=='boolean'||!profile.traits?.bigFive||!profile.context||!profile.narrativeMetadata)throw Error('A behavioural profile is structurally incomplete.');
   if(this.bridge.resolveProfile)this.bridge.resolveProfile(profile);
  }
  if(!frame.presentation||!Number.isFinite(Date.parse(frame.presentation.scenarioAnchorInstant)))throw Error('The session requires a valid absolute calendar anchor.');
  v15ValidateZone(frame.presentation.scenarioTimeZone);
  if(!Number.isFinite(frame.presentation.selectedTimeH)||frame.presentation.selectedTimeH<0||(!allowInvalid&&frame.presentation.selectedTimeH>inspectionHorizon))throw Error('The inspection time must be inside the scenario horizon.');
  frame.markers=v15NormalizeMarkers(frame.markers??[]);
  frame.science=validateScience(frame.science??emptyScience());
  return frame;
 }
 restore(frame,label='Restored session',record=true,allowInvalid=false,atomic=false){
  const safe=this.validateFrame(v15Clone(frame),allowInvalid,Math.max(frame.document.mainScenario.subject.simulationDurationH,acceptedState(this.store.state,this.bridge.snapshot?.()).horizon));
  this.suppress++;
  try{
   this.markers=safe.markers;
   this.scienceDocument=safe.science;
   this.store.transaction(label,()=>{
    const d=safe.document,map={title:d.title,notes:d.notes,preset:d.activePresetMetadata??null,supersededPreset:d.supersededPresetId??null,comparisonTemplate:d.comparisonTemplateId??null,
      subject:d.mainScenario.subject,doses:d.mainScenario.doseEvents,constants:d.mainScenario.constants,comparisons:d.comparisonScenarios,comparisonEnabled:!!d.comparisonEnabled,
      profile:d.behaviourProfile,separateProfiles:!!d.useSeparateBehaviourProfiles,comparisonProfiles:d.comparisonBehaviourProfiles,sweepConfig:d.sweepConfiguration,autosave:!!d.autosaveEnabled};
    for(const [key,value]of Object.entries(map))if(value!==undefined)this.store.field(key,v15Clone(value));
    this.store.field('settings',{...this.store.state.presentation,...safe.presentation,followNow:false,scenarioAnchorDraft:null,scenarioClockError:''});
   });
  }finally{this.suppress--;}
  if(record)this.history.push(this.capture(),label,undefined,{coalesce:!atomic});
  this.changed();return this.capture();
 }
 undo(){
  if(!this.history.canUndo)return;const target=this.history.entries[this.history.index-1].frame;
  this.validateFrame(v15Clone(target),true);this.restore(target,'Undo',false,true);this.history.undo();this.emit();
 }
 redo(){
  if(!this.history.canRedo)return;const target=this.history.entries[this.history.index+1].frame;
  this.validateFrame(v15Clone(target),true);this.restore(target,'Redo',false,true);this.history.redo();this.emit();
 }
 jump(index){
  const target=this.history.entries[index]?.frame;if(!target)throw Error('This history entry is unavailable.');
  this.validateFrame(v15Clone(target),true);this.restore(target,'History restore',false,true);this.history.move(index);this.emit();
 }
 shift(keys,hours,duplicate=false){return this.restore(v15ShiftFrame(this.capture(),keys,hours,duplicate),duplicate?'Duplicated selected events':'Shifted selected events');}
 reanchor(instant,zone,preserve){return this.restore(v15Reanchor(this.capture(),instant,zone,preserve),'Changed calendar anchor');}
 addMarker(marker){
  const next=this.capture();next.markers=v15NormalizeMarkers([...next.markers,{id:v15Id('marker'),...marker}]);this.restore(next,'Added analysis marker');
 }
 removeMarker(id){const next=this.capture();next.markers=next.markers.filter(m=>m.id!==id);this.restore(next,'Removed analysis marker');}
 inspect(timeH){
  const end=acceptedState(this.store.state,this.bridge.snapshot?.()).horizon;
  if(!Number.isFinite(timeH)||timeH<0||timeH>end)throw Error('The requested time is outside the accepted calculation horizon (0 to '+end+' h).');
  this.store.field('settings',{...this.store.state.presentation,selectedTimeH:timeH,selectedTimeProvenance:'manual',selectedLandmarkId:null,followNow:false});
 }
 setDetailMode(mode){
  if(!['default','detailed','expert'].includes(mode))return;
  const view=this.store.state.presentation.resultView;
  if(mode==='default'&&['curves','data'].includes(view))this.store.field('resultView','timeline');
  if(mode==='detailed'&&view==='data')this.store.field('resultView','curves');
  this.store.field('settings',{...this.store.state.presentation,detailMode:mode});
 }
 project(includeHistory=true){
  if(!this.canSave())throw Error('Finish or correct the current input before saving or exporting a session.');
  const frame=this.validateFrame(portableInspection(this.capture()));
  const entries=this.history.entries.map(e=>({label:e.label,at:e.at,frame:portableInspection(v15Clone(e.frame))}));entries[this.history.index].frame=v15Clone(frame);
  const project={schema:V15_PROJECT_SCHEMA,schemaVersion:V15_PROJECT_SCHEMA_VERSION,appVersion:V15_VERSION,scenarioSchemaVersion:'0.8.2',
   versions:{...this.bridge.versions},exportedAt:new Date().toISOString(),frame,
   history:includeHistory?{index:this.history.index,entries}:undefined,importedHistory:includeHistory?this.importedHistory:undefined,scienceResults:this.scienceRuntime?.exportRecords()??[]};
  if(new TextEncoder().encode(JSON.stringify(project)).byteLength>V15_MAX_PROJECT_BYTES)throw Error('This session exceeds 8 MiB. Export without editing history or reduce the observation/result archive.');
  return project;
 }
 importText(text){return this.importObject(v15SafeParse(text),'Imported session');}
 importObject(value,label='Imported session'){
  let frame,archive=[];
  if(value?.schema===V15_PROJECT_SCHEMA){
   if(!['1.0.0',V15_PROJECT_SCHEMA_VERSION].includes(value.schemaVersion))throw Error('This session uses an unsupported document version.');
   if(value.versions?.modelEngineVersion&&value.versions.modelEngineVersion!==this.bridge.versions.modelEngineVersion)throw Error('This session requires engine '+value.versions.modelEngineVersion+'. Use the matching archived release to reproduce it.');
   frame=this.validateFrame(v15Clone(value.frame));
   if(value.history){
    if(!Array.isArray(value.history.entries)||value.history.entries.length>60||!Number.isInteger(value.history.index))throw Error('The supplied history is invalid.');
    archive=value.history.entries.map(e=>({label:String(e.label??'Imported edit').slice(0,200),at:new Date(e.at).toISOString(),frame:this.validateFrame(v15Clone(e.frame),true)}));
    if(value.history.index<0||value.history.index>=archive.length)throw Error('The supplied history cursor is invalid.');
    if(v15Stable(archive[value.history.index].frame)!==v15Stable(frame))throw Error('The history cursor does not match the exported working state.');
   }
   const prior=value.importedHistory??[];
   if(!Array.isArray(prior)||prior.length>120)throw Error('Imported editing history exceeds 120 entries or is malformed.');
   const previous=prior.map(e=>({label:String(e.label??'Imported edit').slice(0,200),at:new Date(e.at).toISOString(),frame:this.validateFrame(v15Clone(e.frame),true)})),seen=new Set();
   archive=[...previous,...archive].filter(e=>{const key=v15Stable(e);if(seen.has(key))return false;seen.add(key);return true;});
   if(archive.length>120)throw Error('Combined imported editing history exceeds 120 entries. Export without history to import only the working state.');
  }else frame=this.validateFrame(this.bridge.importLegacy(value));
  const records=value?.schema===V15_PROJECT_SCHEMA?(value.scienceResults??[]):[];
  if(!Array.isArray(records)||records.length>3||records.some(r=>!r||!['fit','evaluate','uncertainty','benchmarks'].includes(r.kind)||typeof r.sourceKey!=='string'||r.sourceKey.length>300000||JSON.stringify(r).length>600000))throw Error('Scientific result archive is invalid or exceeds its size limit.');
  this.restore(frame,label);
  this.scienceRuntime?.importRecords(records);
  this.importedHistory=archive;this.emit();
  return frame;
 }

 async setRecovery(enabled){
  this.recoveryEnabled=!!enabled;
  try{await this.storage.put({id:'preferences',kind:'preferences',recoveryEnabled:this.recoveryEnabled});this.storageStatus='ready';if(enabled)await this.flushRecovery();}
  catch(error){this.storageStatus='failed';this.message=error.message;throw error;}finally{this.emit();}
 }
 scheduleRecovery(){if(!this.recoveryEnabled)return;clearTimeout(this.timer);this.timer=setTimeout(()=>this.flushRecovery().catch(()=>{}),350);}
 async flushRecovery(force=false){
  clearTimeout(this.timer);
  if(!force&&!this.recoveryEnabled)return;
  if(!this.canSave()){this.storageStatus='blocked';this.message='Recovery is waiting for complete, valid committed inputs.';this.emit();return;}
  const record={id:'recovery',kind:'recovery',updatedAt:new Date().toISOString(),project:this.project(false)},serial=++this.writeSerial;
  this.storageStatus='saving';this.emit();
  const pending=this.writeChain.catch(()=>{}).then(()=>this.storage.put(record));this.writeChain=pending;
  try{await pending;if(serial===this.writeSerial){this.recovery=record;this.storageStatus='saved';this.message='Recovery copy saved at '+new Date(record.updatedAt).toLocaleTimeString();}}
  catch(error){if(serial===this.writeSerial){this.storageStatus='failed';this.message=error.message;}throw error;}
  finally{this.emit();}
  return record;
 }
 async saveNamed(name){
  if(typeof name!=='string'||!name.trim()||name.length>160)throw Error('Enter a saved-state name of up to 160 characters.');
  if(this.projects.length>=40)throw Error('This browser contains 40 saved states. Export and remove an older state before adding another.');
  const record={id:v15Id('project'),kind:'project',label:name.trim(),updatedAt:new Date().toISOString(),project:this.project(true)};
  await this.storage.put(record);this.projects.unshift(record);this.emit();return record;
 }
 async deleteNamed(id){await this.storage.remove(id);this.projects=this.projects.filter(p=>p.id!==id);this.emit();}
 async clearRecovery(){await this.storage.remove('recovery');this.recovery=null;this.emit();}
 restoreRecovery(){if(!this.recovery)throw Error('No recovery copy is available.');return this.importObject(this.recovery.project,'Restored recovery copy');}
 loadNamed(id){const p=this.projects.find(p=>p.id===id);if(!p)throw Error('Saved state not found.');return this.importObject(p.project,'Loaded '+p.label);}
 setBaseline(savedId){
  const source=savedId==='current'?this.capture():this.projects.find(p=>p.id===savedId)?.project.frame;
  if(!source)throw Error('Select an available saved state.');
  const current=this.capture(),a=v15Clone(source.document.mainScenario),b=v15Clone(current.document.mainScenario);
  a.id='A';a.label=source.document.title||'Saved baseline';a.notes=source.document.notes;a.calendarAnchorInstant=source.presentation.scenarioAnchorInstant;a.calendarTimeZone=source.presentation.scenarioTimeZone;
  b.id='B';b.label=current.document.title||'Current scenario';b.notes=current.document.notes;b.calendarAnchorInstant=current.presentation.scenarioAnchorInstant;b.calendarTimeZone=current.presentation.scenarioTimeZone;
  current.document.comparisonEnabled=true;current.document.comparisonScenarios={A:a,B:b};
  current.document.useSeparateBehaviourProfiles=true;
  current.document.comparisonBehaviourProfiles={A:v15Clone(source.document.behaviourProfile),B:v15Clone(current.document.behaviourProfile)};
  this.restore(current,'Prepared baseline comparison');
 }
 comparisonInput(){
  const d=this.store.state.document;
  return {scenarios:v15Clone(d.comparisonScenarios),profile:v15Clone(d.behaviourProfile),
   profiles:d.useSeparateBehaviourProfiles?v15Clone(d.comparisonBehaviourProfiles):null};
 }
 async requestComparison(){
  if(!this.store.state.document.comparisonEnabled)return null;
  const input=this.comparisonInput(),key=v15Stable(input);
  if(this.comparisonKey===key&&this.comparison)return this.comparison;
  this.comparisonKey=key;const serial=++this.comparisonSerial,requestId='v15-compare-'+serial;
  if(this.comparisonRequest)for(const side of ['A','B'])this.bridge.runtime.cancelRequest(this.comparisonRequest+'-'+side,'superseded');
  this.comparisonRequest=requestId;this.comparison={status:'pending'};this.emit();
  try{
   const result=await this.bridge.runtime.submitComparison({requestId,consumerId:'v15-comparison',...input});
   if(serial!==this.comparisonSerial||key!==v15Stable(this.comparisonInput()))return null;
   this.comparison={...result,input,key};
   if(result.status==='valid')for(const side of ['A','B'])this.bridge.runtime.pinSnapshot(result[side].snapshotId,'v15-comparison-'+side);
  }catch(error){if(serial===this.comparisonSerial)this.comparison={status:'failed',message:error.message};}
  this.emit();return this.comparison;
 }
 async counterfactual(eventId){
  const state=this.store.state,snapshot=this.bridge.snapshot();
  if(!snapshot||state.snapshots.relationToDraft!=='current')throw Error('Wait for a current accepted calculation before evaluating an intake.');
  const a=v15Clone(state.accepted.canonicalScenario),b=v15Clone(a),event=b.doseEvents.find(e=>e.id===eventId);
  if(!event)throw Error('The intake is unavailable in the accepted scenario.');
  b.doseEvents=b.doseEvents.filter(e=>e.id!==eventId);
  const requestId='v15-counterfactual-'+v15Id('run'),profile=v15Clone(state.document.behaviourProfile);
  const result=await this.bridge.runtime.submitComparison({requestId,consumerId:'v15-counterfactual',scenarios:{A:a,B:b},profile});
  return {...result,event:v15Clone(event),sourceSnapshotId:snapshot.snapshotId,inputKey:state.accepted.numericalKey};
 }
 dispose(){clearTimeout(this.timer);for(const side of ['A','B'])this.bridge.runtime.releaseOwner('v15-comparison-'+side);this.listeners.clear();}
}
