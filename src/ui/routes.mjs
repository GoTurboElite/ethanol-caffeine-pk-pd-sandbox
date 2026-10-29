export const SCIENTIFIC_VIEWS=['validation','calibration','uncertainty','evidence'];
export const SCIENTIFIC_TASKS=[
 ['Evaluation','validation','Compare measured concentrations with the model.'],
 ['Calibration','calibration','Fit selected parameters to calibration observations.'],
 ['Uncertainty','uncertainty','Explore the supplied parameter distributions.'],
 ['Evidence','evidence','Inspect sources, assumptions and model limitations.']
];
export const ANALYSIS_ROUTES=[['Overview','session','overview'],['Explain','session','explain'],['Behaviour','behaviour',''],['Scientific workbench','session','validation'],['Parameters','session','parameters'],['Diagnostics','expert',''],['Numerical data','results','data']];
export function locationFor(state){
 const r=state.presentation.selectedWorkspace,v=state.presentation.selectedSubview||'timeline';
 if(r==='help')return {group:'help',title:'How to use',view:'help',native:true};
 if(r==='session'){
  if(v==='timeline')return {group:'session',title:'Session',view:v,native:true};
  if(v==='observations')return {group:'session',title:'Concentration observations',view:v,native:true};
  if(SCIENTIFIC_VIEWS.includes(v))return {group:'analysis',title:'Scientific workbench',view:v,native:true};
  if(v==='compare')return {group:'compare',title:'Compare scenarios',view:v,native:true};
  if(v==='projects')return {group:'saved',title:'Saved sessions',view:v,native:true};
  if(v==='report')return {group:'document',title:'Analysis report',view:v,native:true};
  return {group:'analysis',title:v==='overview'?'Analysis':v==='parameters'?'Parameters and assumptions':'Explain model state',view:v,native:true};
 }
 if(r==='calculate')return {group:'session',title:'Session inputs',view:'inputs',native:false};
 if(r==='explore')return {group:'compare',title:state.presentation.exploreView==='sweep'?'Sensitivity analysis':'Comparison editor',view:'explore',native:false};
 if(r==='export')return {group:'document',title:'Export analytical data',view:'export',native:false};
 return {group:'analysis',title:r==='expert'?'Model diagnostics':r==='behaviour'?'Behavioural interpretation':'Numerical results',view:r,native:false};
}
export function routeActive(state,route,view){
 if(route==='session'&&view==='validation')return state.presentation.selectedWorkspace==='session'&&SCIENTIFIC_VIEWS.includes(state.presentation.selectedSubview);
 return state.presentation.selectedWorkspace===route&&(view?(state.presentation.selectedSubview||'timeline')===view:route!=='session');
}
export function calculationState(state){
 const snapshot=state.snapshots.currentSnapshotId;
 if(state.editingInvalidCount||state.draft.validation.status==='invalid')return {kind:'invalid',label:'Input requires attention',description:snapshot?'The preview retains the previous accepted inputs. Correct the invalid field to continue.':'Correct the invalid field before calculating.'};
 if(['queued','running'].includes(state.execution.status))return {kind:'pending',label:'Updating calculation',description:snapshot?'The previous accepted result stays visible until this calculation succeeds.':'Preparing the first accepted result.'};
 if(state.execution.status==='failed')return {kind:'failed',label:'Calculation failed',description:snapshot?'The previous accepted result is retained. Review the inputs or retry.':'Review the inputs and retry the calculation.'};
 if(state.snapshots.relationToDraft==='current')return {kind:'current',label:'Current calculation',description:'Results match the committed scenario.'};
 return {kind:'previous',label:snapshot?'Previous accepted result':'Preparing calculation',description:snapshot?'The committed inputs have changed. Choose Update calculation to refresh the result.':'Enter valid intakes to calculate a scenario.'};
}
