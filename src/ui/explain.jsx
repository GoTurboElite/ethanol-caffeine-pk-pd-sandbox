import {h,React,Fragment,bridge,controller,action,announce,useSession,accepted} from './runtime.mjs';
import {Panel,Button,Table,Metric,SnapshotNotice,Inspector,EmptyResult} from './common.jsx';
import {v15Fluxes,v15Number,v15MetricRows,v15Diff,v15TimeLabel} from '../session/core.mjs';
import {bacText,bacUnit,bacValue} from './units.mjs';
export function V15Explain(){
 const state=useSession(),{snapshot,result,input,current}=accepted(),[eventId,setEventId]=React.useState(''),[counter,setCounter]=React.useState(null),[busy,setBusy]=React.useState(false);
 const identity=state.accepted?.numericalKey;
 React.useEffect(()=>{setCounter(null);setBusy(false);},[identity]);
 if(!result)return <EmptyResult/>;
 const flux=v15Fluxes(result,state.presentation.selectedTimeH),p=flux?.point,detail=state.presentation.detailMode;
 const rows=[['Gastric ethanol','gastricEthanolG','g'],['Intestinal ethanol','intestinalEthanolG','g'],['Central ethanol','centralEthanolG','g'],['Caffeine in gut','caffeineGutMg','mg'],['Central caffeine','caffeineCentralMg','mg'],['Central paraxanthine','paraxanthineCentralMg','mg']].filter(([,k])=>p?.[k]!==undefined).map(([label,k,u])=>[label,v15Number(p[k],5),u]);
 const pd=[
  ['Ethanol impairment proxy','ethanolImpairmentIndex','Exposure-related BAC response transform. Zero denotes the no-exposure baseline.'],
  ['Caffeine activation proxy','caffeineAlertnessIndex','Concentration-response transform with the selected tolerance and optional metabolite assumptions.'],
  ['Combined alertness proxy','combinedAlertnessIndex','Clipped baseline-plus-response heuristic. The retained no-exposure encoding is zero.'],
  ['Perceived control proxy','perceivedControlIndex','Constructed response using the configured calibration and pharmacological terms. The retained no-exposure encoding is zero.'],
  ['Mismatch proxy','mismatchIndex','Constructed coexistence of activation/perceived control and ethanol-related impairment.']
 ];
 const evaluate=()=>action(async()=>{
  if(!eventId)throw Error('Select an intake to remove.');
  setBusy(true);setCounter(null);
  try{const value=await controller.counterfactual(eventId);setCounter(value);}finally{setBusy(false);}
 });
 return <div className="v15-stack"><SnapshotNotice state={state} snapshot={snapshot}/>
  <Panel title="Why the model has this state" kicker="Selected-time explanation"><Inspector state={state} result={result}/>
   <div className="v15-metrics"><Metric label="BAC" value={bacText(p?.bacGdL,state.presentation)} unit={bacUnit(state.presentation)}/><Metric label="Caffeine" value={v15Number(p?.caffeineMgL,4)} unit="mg/L"/><Metric label="BAC trajectory slope" value={v15Number(bacValue(p?.bacRateGdLPerH,state.presentation),5)} unit={bacUnit(state.presentation)+'/h'}/></div>
   <p>Compartment amounts, distribution assumptions and the accepted trajectory determine these concentrations. Response indices add the separately defined PD and behavioural transformations.</p>
   <Table headers={['Compartment','Amount','Unit']} rows={rows}/>
  </Panel>
  <Panel title="Active kinetic assumptions"><Table headers={['Assumption','Accepted value']} rows={[
   ['Distribution formulation',input.subject.bodyCompositionMode],['Resolved distribution basis',result.distribution?.formula??'See Expert distribution details'],['Ethanol elimination',input.subject.ethanolEliminationMode],
   ['Food state',input.subject.foodState],['Explicit meal events',input.subject.mealEvents?.length??0],['Caffeine formulation',input.subject.caffeineParameterMode],
   ['Effective/reference caffeine half-life',v15Number(input.subject.caffeineParameterMode==='direct effective half-life'?input.subject.caffeineHalfLifeH:input.subject.referenceCaffeineHalfLifeH)+' h'],
   ['Paraxanthine approximation',input.constants.paraxanthineApproximationEnabled?'Enabled':'Disabled'],['Optional ethanol-linked caffeine-clearance interaction',input.constants.optionalEthanolInhibitsCaffeineClearance?'Enabled':'Disabled']
  ]}/></Panel>
  {detail!=='default'&&flux&&<Panel title="Local appearance and elimination rates" kicker="Derived from the dense accepted trajectory"><Table headers={['Quantity','Estimated rate','Unit']} rows={[
   ['Systemic ethanol appearance',v15Number(flux.ethanolSystemicAppearanceGPerH,5),'g/h'],['Ethanol elimination',v15Number(flux.ethanolEliminationGPerH,5),'g/h'],['Systemic caffeine appearance',v15Number(flux.caffeineSystemicAppearanceMgPerH,5),'mg/h'],['Caffeine elimination',v15Number(flux.caffeineEliminationMgPerH,5),'mg/h']
  ]}/><p className="v15-note">{flux.method} Interval width: {v15Number(flux.intervalH*60,4)} min.</p></Panel>}
  <Panel title="Definitions of the functional indices"><p>These are defined heuristic scales. The source model encodes no active exposure with zero-valued indices; the configured baseline terms operate inside the exposure-response calculation.</p><Table headers={['Index','Value on a 0–100 scale','Meaning']} rows={pd.filter(([,key])=>p?.[key]!==undefined).map(([label,key,definition])=>[label,v15Number(p[key]*100,3),definition])}/></Panel>
  <Panel title="Remove one intake counterfactual"><p>Evaluate the original accepted schedule against the same schedule after one intake is removed. This conditional difference includes shared nonlinear dynamics.</p>
   <div className="v15-actions"><label className="v15-field">Accepted intake<select value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select an intake</option>{input.doseEvents.map(e=><option key={e.id} value={e.id}>{e.label||e.id} · {v15TimeLabel(e.startTimeH)}</option>)}</select></label><Button primary disabled={!current||busy||!eventId} onClick={evaluate}>{busy?'Evaluating…':'Evaluate removal'}</Button></div>
   {!current&&<p>Wait for a current accepted result before evaluating a counterfactual.</p>}
   {counter?.status==='valid'&&counter.inputKey===state.accepted?.numericalKey&&<><p>Removed: <strong>{counter.event.label}</strong>. Delta = remaining schedule minus original schedule.</p><Table headers={['Output','Original','Remaining schedule','Delta','Unit']} rows={v15MetricRows(counter.A.numerical,counter.B.numerical).map(x=>[x.label,v15Number(x.a,5),v15Number(x.b,5),v15Number(x.delta,5),x.unit])}/></>}
   {counter&&counter.status!=='valid'&&<p role="alert">Counterfactual status: {counter.status}. {counter.message}</p>}
  </Panel>
  {detail==='expert'&&<Panel title="Selected-time numerical provenance"><p>Current inspection is interpolated from the accepted dense trajectory. The original Expert workspace retains complete diagnostics and coefficient provenance.</p><pre className="v15-code">{JSON.stringify({snapshotId:snapshot.snapshotId,solver:result.solver,convergence:result.convergence,integrity:result.integrity,selectedPoint:p},null,2)}</pre></Panel>}
 </div>;
}
