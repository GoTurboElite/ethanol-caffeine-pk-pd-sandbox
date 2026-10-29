const V2_VERSIONS=Object.freeze({...qt,scientificWorkbenchVersion:'1.0.0',referenceModelProfile:'reference-1.60',evidenceVersion:'2026-10-28.1',sessionSchemaVersion:'1.1.0'});
const V15Integration=PKPDV15.createV15UI({
 React:M,store:canonicalStore,runtime:simulationRuntime,versions:V2_VERSIONS,scienceCore:PKCore,
 parameters:[...XJ,...QJ].filter(p=>/^(subject|constants)\./.test(p.id)),
 ethanolAmount:(event,constants)=>Ta(event,constants),caffeineAmount:event=>Na(event),
 openSurface:surface=>window.dispatchEvent(new CustomEvent('pkpd-ui-action',{detail:{surface}})),
 validate:input=>simulationRuntime.validateDraft(input),
 resolveProfile:profile=>Bm(profile),
 snapshot:()=>simulationRuntime.getSnapshot(canonicalStore.state.snapshots.currentSnapshotId),
 importLegacy(value){
  const checked=simulationRuntime.validateScenarioFile(value);
  if(!checked.ok||!checked.value)throw Error('Legacy scenario import rejected: '+(checked.errors??[]).join(' '));
  const flat=TN(checked.value,canonicalStore.documentExport(),{importComparison:true}),frame=V15Integration.controller.capture();
  frame.document={title:flat.title,notes:flat.notes,activePresetMetadata:flat.activePresetId?{id:flat.activePresetId,label:flat.activePresetLabel,baselineFingerprint:flat.activePresetBaselineFingerprint}:null,
   supersededPresetId:flat.supersededPresetId,comparisonTemplateId:flat.comparisonTemplateId,mainScenario:{subject:flat.subject,doseEvents:flat.doseEvents,constants:flat.constants},
   comparisonScenarios:flat.comparisonScenarios,comparisonEnabled:flat.comparisonEnabled,behaviourProfile:flat.behaviourProfile,useSeparateBehaviourProfiles:flat.useSeparateBehaviourProfiles,comparisonBehaviourProfiles:flat.comparisonBehaviourProfiles,sweepConfiguration:flat.sweepConfig,autosaveEnabled:frame.document.autosaveEnabled};
  for(const key of ['scenarioAnchorInstant','scenarioTimeZone','timeDisplayMode','selectedTimeH','selectedTimeProvenance','selectedLandmarkId','followNow'])frame.presentation[key]=flat.settings[key];
  frame.markers=[];delete frame.science;return frame;
 },
 loadDemo(kind){
  const frame=V15Integration.controller.capture(),subject=It(St),constants=bt(St.bodyMassKg);
  const event=(id,label,startTimeH,durationMin,ethanolGrams,caffeineMg)=>({id,label,startTimeH,durationMin,ethanolGrams,caffeineMg,servings:1});
  let doses,title;
  if(kind==='episodes'){title='Worked example: two ethanol episodes';doses=[event('demo-first','First episode',0,60,60,0),event('demo-second','Second episode',12,60,40,0)];}
  else if(kind==='overnight'){title='Worked example: overnight mixed scenario';doses=[event('demo-evening','Evening intake',0,60,20,0),event('demo-coffee','Later coffee',3,15,0,95)];}
  else{title='Worked example: single coffee';doses=[event('demo-coffee','Coffee',0,15,0,95)];}
  frame.document.title=title;frame.document.notes='Synthetic worked example using 90 kg reference physiology and the retained model defaults.';
  frame.document.mainScenario={subject,doseEvents:doses,constants};frame.document.activePresetMetadata=null;frame.document.comparisonEnabled=false;frame.document.behaviourProfile=hn();
  frame.presentation.scenarioAnchorInstant='2026-01-01T20:00:00.000Z';frame.presentation.scenarioTimeZone='UTC';frame.presentation.selectedTimeH=0;frame.presentation.selectedTimeProvenance='manual';frame.presentation.followNow=false;
  frame.markers=kind==='overnight'?[{id:'demo-bedtime',label:'Planned bedtime',kind:'bedtime',timeH:5},{id:'demo-waking',label:'Waking inspection',kind:'waking',timeH:13}]:[];
  V15Integration.controller.restore(frame,'Loaded worked example');
 }
});
const V160_PUBLIC=Object.freeze({version:'2.1.0',releaseLabel:'2.1',controller:V15Integration.controller,pwa:V15Integration.pwa,preferences:V15Integration.preferences,science:V15Integration.science,store:canonicalStore,runtime:simulationRuntime,versions:V2_VERSIONS});
Object.defineProperty(window,'__PK_SANDBOX_V15__',{value:V160_PUBLIC,enumerable:false});
Object.defineProperty(window,'__PK_SANDBOX_V160__',{value:V160_PUBLIC,enumerable:false});
Object.defineProperty(window,'__PK_SANDBOX_V2__',{value:V160_PUBLIC,enumerable:false});
