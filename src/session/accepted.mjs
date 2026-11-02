import {scenarioDifferences} from './differences.mjs';
export function acceptedState(state,snapshot,registry=[]){
 const result=snapshot?.numerical??null,input=snapshot?.canonicalScenario??state.accepted?.canonicalScenario??null,draft=state.document.mainScenario;
 const horizon=result?.summary?.horizonH??result?.analysisPoints?.at(-1)?.tH??result?.points?.at(-1)?.tH??draft.subject.simulationDurationH;
 const current=!!snapshot&&state.snapshots.relationToDraft==='current'&&!state.editingInvalidCount;
 const changes=scenarioDifferences(input,draft,registry);
 return {state,snapshot,result,input,current,horizon,time:Math.max(0,Math.min(horizon,Number(state.presentation.selectedTimeH)||0)),changes,label:snapshot?(current?'Accepted inputs':'Previous accepted inputs'):'Committed draft inputs'};
}
export function portableInspection(frame){
 const end=frame.document.mainScenario.subject.simulationDurationH;
 const time=Math.max(0,Math.min(end,frame.presentation.selectedTimeH));
 if(time!==frame.presentation.selectedTimeH)Object.assign(frame.presentation,{selectedTimeProvenance:'manual',selectedLandmarkId:null,followNow:false});
 frame.presentation.selectedTimeH=time;return frame;
}
