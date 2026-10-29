import {v15Stable} from './core.mjs';
export function acceptedState(state,snapshot){
 const result=snapshot?.numerical??null,input=snapshot?.canonicalScenario??state.accepted?.canonicalScenario??null,draft=state.document.mainScenario;
 const horizon=result?.summary?.horizonH??result?.analysisPoints?.at(-1)?.tH??result?.points?.at(-1)?.tH??draft.subject.simulationDurationH;
 const current=!!snapshot&&state.snapshots.relationToDraft==='current'&&!state.editingInvalidCount;
 const changes=[];
 if(input){
  for(const [key,label] of [['bodyMassKg','Body mass (kg)'],['simulationDurationH','Horizon (h)'],['foodState','Food state'],['caffeineHalfLifeH','Effective caffeine half-life (h)']])if(v15Stable(input.subject[key])!==v15Stable(draft.subject[key]))changes.push({label,accepted:String(input.subject[key]),draft:String(draft.subject[key])});
  if(v15Stable(input.doseEvents)!==v15Stable(draft.doseEvents))changes.push({label:'Intake schedule',accepted:input.doseEvents.length+' intakes',draft:draft.doseEvents.length+' intakes; amounts or timing may differ'});
  const explicit=new Set(['bodyMassKg','simulationDurationH','foodState','caffeineHalfLifeH']);
  const other=Object.keys({...input.subject,...draft.subject}).filter(k=>!explicit.has(k)&&v15Stable(input.subject[k])!==v15Stable(draft.subject[k]));
  if(other.length)changes.push({label:'Other physiology / PK inputs',accepted:'Captured values',draft:other.join(', ')});
  const constants=Object.keys({...input.constants,...draft.constants}).filter(k=>v15Stable(input.constants[k])!==v15Stable(draft.constants[k]));
  if(constants.length)changes.push({label:'Model constants',accepted:'Captured values',draft:constants.join(', ')});
 }
 return {state,snapshot,result,input,current,horizon,time:Math.max(0,Math.min(horizon,Number(state.presentation.selectedTimeH)||0)),changes,label:snapshot?(current?'Accepted inputs':'Previous accepted inputs'):'Committed draft inputs'};
}
export function portableInspection(frame){
 const end=frame.document.mainScenario.subject.simulationDurationH;
 const time=Math.max(0,Math.min(end,frame.presentation.selectedTimeH));
 if(time!==frame.presentation.selectedTimeH)Object.assign(frame.presentation,{selectedTimeProvenance:'manual',selectedLandmarkId:null,followNow:false});
 frame.presentation.selectedTimeH=time;return frame;
}
