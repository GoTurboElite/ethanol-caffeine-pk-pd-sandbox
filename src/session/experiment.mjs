import {v15Clone,v15Stable} from './core.mjs';
export const EXPERIMENT_SCHEMA='1.0.0';
export const EXPERIMENT_MODEL='reference-1.60';
export function inputIdentity(input){const key=v15Stable(input);let hash=2166136261;for(let i=0;i<key.length;i++)hash=Math.imul(hash^key.charCodeAt(i),16777619);return 'I-'+(hash>>>0).toString(16).padStart(8,'0');}
export function freezeTree(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);for(const v of Object.values(value))freezeTree(v);}return value;}
export function validateExperiment(value,validate){
 if(value==null)return null;
 const e=v15Clone(value);
 if(e.schemaVersion!==EXPERIMENT_SCHEMA||e.model!==EXPERIMENT_MODEL||typeof e.name!=='string'||e.name.length>160||!Number.isFinite(Date.parse(e.createdAt)))throw Error('Unsupported or malformed experiment record.');
 if(!e.reference?.scenario||typeof e.reference.inputKey!=='string'||e.reference.inputKey!==v15Stable(e.reference.scenario)||e.reference.id!==inputIdentity(e.reference.scenario)||typeof e.reference.snapshotId!=='string'||typeof e.reference.fingerprint!=='string')throw Error('Experiment reference identity does not match its captured scenario.');
 const profile=e.reference.profile;if(!profile||typeof profile.applied!=='boolean'||!profile.traits?.bigFive||!profile.context||!profile.narrativeMetadata)throw Error('Experiment reference requires a complete captured behavioural profile.');
 for(const scenario of [e.reference.scenario,e.draft]){if(!scenario||validate(scenario).status!=='valid')throw Error('Experiment contains invalid scenario inputs.');}
 if(JSON.stringify(e).length>400000)throw Error('Experiment record exceeds 400,000 characters.');
 return freezeTree(e);
}
export class ExperimentController{
 constructor(session,bridge){this.session=session;this.bridge=bridge;this.listeners=new Set();this.revision=0;this.serial=0;this.status='idle';this.error='';this.result=null;this.sweep=null;this.progress=null;this.unsubscribe=session.subscribe(()=>{if(['running','sweeping'].includes(this.status)&&this.runningKey!==this.key())this.cancel('Experiment changed; calculation cancelled.');this.emit();});}
 subscribe=fn=>{this.listeners.add(fn);return()=>this.listeners.delete(fn);};snapshot=()=>this.revision;
 emit(){this.revision++;for(const fn of this.listeners)fn();}
 get record(){return this.session.experiment;}
 key(){return this.record?v15Stable({reference:this.record.reference,draft:this.record.draft,model:this.record.model}):null;}
 get current(){return !!this.result&&this.result.key===this.key();}
 create(draft=null,name='Experiment'){
  const s=this.bridge.snapshot();if(!s||!this.session.canSave()||this.session.store.state.snapshots.relationToDraft!=='current')throw Error('Accept a complete main scenario before establishing a reference.');
  const scenario=v15Clone(s.canonicalScenario),frame=this.session.capture();frame.experiment={schemaVersion:EXPERIMENT_SCHEMA,model:EXPERIMENT_MODEL,name,createdAt:new Date().toISOString(),reference:{id:inputIdentity(scenario),inputKey:v15Stable(scenario),scenario,profile:v15Clone(frame.document.behaviourProfile),snapshotId:s.snapshotId,fingerprint:this.bridge.versions.buildFingerprint},draft:v15Clone(draft??scenario)};this.session.restore(frame,'Established experimental reference',true,false,true);this.sweep=null;this.status='idle';this.error='';this.emit();
 }
 edit(draft,label='Edited experimental draft'){if(!this.record)throw Error('Create an experiment first.');const frame=this.session.capture();frame.experiment={...v15Clone(this.record),draft:v15Clone(draft)};this.session.restore(frame,label,true,false,true);this.status='idle';this.error='';this.emit();}
 reset(){this.edit(this.record.reference.scenario,'Restored experimental reference');}
 clear(){const frame=this.session.capture();frame.experiment=null;this.session.restore(frame,'Closed experiment',true,false,true);this.cancel();this.result=null;this.sweep=null;for(const side of ['A','B'])this.bridge.runtime.releaseOwner('experiment-'+side);}
 invalidateRestoration(){this.cancel('');this.result=null;this.sweep=null;this.status='idle';this.error='';this.emit();}
 apply(){if(!this.current||['running','sweeping'].includes(this.status)||!this.session.canSave())throw Error('Calculate the current experimental draft and complete main inputs before applying.');const frame=this.session.capture();frame.document.mainScenario=v15Clone(this.record.draft);frame.document.activePresetMetadata=null;frame.presentation.selectedTimeH=Math.min(frame.presentation.selectedTimeH,frame.document.mainScenario.subject.simulationDurationH);this.session.restore(frame,'Applied experiment '+this.record.name,true,false,true);}
 cancel(message='Experiment calculation cancelled.'){
  this.serial++;if(this.requestId)for(const side of ['A','B'])this.bridge.runtime.cancelRequest(this.requestId+'-'+side,'superseded');this.worker?.terminate();this.worker=null;this.rejectSweep?.(Error(message||'Sweep superseded.'));this.rejectSweep=null;this.sweepCancelled=true;this.status='cancelled';this.error=message;this.emit();
 }
 async runSweep(axes){
  if(!this.record)throw Error('Create an experiment first.');this.cancel('');const serial=++this.serial,source=v15Clone(this.record.draft),key=this.key();this.runningKey=key;this.status='sweeping';this.error='';this.progress={done:0,total:1};this.emit();
  const progress=(done,total)=>{if(serial===this.serial){this.progress={done,total};this.emit();}},local=async()=>{const {sweep}=await import('../science/exploration.mjs');return sweep(this.bridge.scienceCore,source,axes,{cancelled:()=>serial!==this.serial,progress});};
  try{let result;if(globalThis.Worker){try{result=await new Promise((resolve,reject)=>{this.rejectSweep=reject;const code=document.getElementById('pk-kernel-source').textContent+'\n'+document.getElementById('pk-science-worker-source').textContent,url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));this.worker=new Worker(url);URL.revokeObjectURL(url);this.worker.onmessage=e=>{const d=e.data;if(d.id!==serial)return;if(d.type==='progress')progress(d.done,d.total);else if(d.type==='result')resolve(d.result);else reject(Error(d.message));};this.worker.onerror=e=>reject(Error(e.message||'Worker failed.'));this.worker.postMessage({id:serial,request:{kind:'exploration',input:source,axes}});});}catch(e){if(serial!==this.serial||!/worker|content security|script|blob|network/i.test(e.message))throw e;this.worker?.terminate();result=await local();}}else result=await local();
   if(serial!==this.serial||key!==this.key())return null;this.sweep={...result,sourceKey:key,fingerprint:this.bridge.versions.buildFingerprint,model:EXPERIMENT_MODEL,computedAt:new Date().toISOString()};this.status='complete';this.worker?.terminate();this.worker=null;this.rejectSweep=null;this.emit();return this.sweep;
  }catch(e){if(serial===this.serial){this.status='failed';this.error=e.message;this.worker?.terminate();this.worker=null;this.rejectSweep=null;this.emit();}throw e;}
 }
 async calculate(){
  if(!this.record)throw Error('Create an experiment first.');this.cancel('');const serial=++this.serial,key=this.key(),record=v15Clone(this.record);this.runningKey=key;this.status='running';this.error='';this.requestId='experiment-'+serial;this.emit();
  try{const value=await this.bridge.runtime.submitComparison({requestId:this.requestId,consumerId:'experimental-workbench',scenarios:{A:record.reference.scenario,B:record.draft},profile:v15Clone(record.reference.profile)});
   if(serial!==this.serial||key!==this.key())return null;if(value.status!=='valid')throw Error(value.message||'Experiment calculation did not return valid trajectories.');
   for(const side of ['A','B']){this.bridge.runtime.releaseOwner('experiment-'+side);this.bridge.runtime.pinSnapshot(value[side].snapshotId,'experiment-'+side);}
   this.result={...value,key,record,computedAt:new Date().toISOString(),fingerprint:this.bridge.versions.buildFingerprint};this.status='complete';this.emit();return this.result;
  }catch(e){if(serial===this.serial){this.status='failed';this.error=e.message;this.emit();}throw e;}
 }
 dispose(){this.cancel();this.unsubscribe?.();for(const side of ['A','B'])this.bridge.runtime.releaseOwner('experiment-'+side);this.listeners.clear();}
}
