import {h,React,Fragment,bridge,controller,science,useScience,action,announce,useSession,accepted} from './runtime.mjs';
import {Panel,Button,Table,Metric,SnapshotNotice,Inspector,EmptyResult} from './common.jsx';
import {v15Fluxes,v15Number,v15MetricRows,v15Diff,v15TimeLabel} from '../session/core.mjs';
import {Mechanism} from './mechanism.jsx';
import {ResultOrigin} from './context.jsx';
import {bacText,bacUnit,bacValue,bacMetric} from './units.mjs';
export function V15Explain(){
 const state=useSession(),{snapshot,result,input,current,time}=accepted(),[eventId,setEventId]=React.useState(''),[counter,setCounter]=React.useState(null),[busy,setBusy]=React.useState(false);
 useScience();const convergence=science.resultFor('convergence');
 const identity=state.accepted?.numericalKey;
 React.useEffect(()=>{setCounter(null);setBusy(false);},[identity]);
 if(!result)return <EmptyResult/>;
 const flux=v15Fluxes(result,time),p=flux?.point,detail=state.presentation.detailMode;
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
 return <div className="v15-stack"><ResultOrigin/>
  <Panel title="Why the model has this state" kicker="Selected-time explanation"><Inspector state={state} result={result}/>
   <div className="v15-metrics"><Metric label="BAC" value={bacText(p?.bacGdL,state.presentation)} unit={bacUnit(state.presentation)}/><Metric label="Caffeine" value={v15Number(p?.caffeineMgL,4)} unit="mg/L"/><Metric label="BAC trajectory slope" value={v15Number(bacValue(p?.bacRateGdLPerH,state.presentation),5)} unit={bacUnit(state.presentation)+'/h'}/></div>
   <p>Compartment amounts, distribution assumptions and the accepted trajectory determine these concentrations. Response indices add the separately defined PD and behavioural transformations.</p>
   <Table headers={['Compartment','Amount','Unit']} rows={rows}/><Mechanism input={input} result={result} time={time} end={result.summary.horizonH} depth={detail} onInspect={t=>controller.inspect(t)}/>
  </Panel>
  <Panel title="Active kinetic assumptions"><Table headers={['Assumption','Accepted value']} rows={[
   ['Distribution formulation',input.subject.bodyCompositionMode],['Resolved distribution basis',result.distribution?.formula??'See Expert distribution details'],['Ethanol elimination',input.subject.ethanolEliminationMode],
   ['Food state',input.subject.foodState],['Explicit meal events',input.subject.mealEvents?.length??0],['Caffeine formulation',input.subject.caffeineParameterMode],
   ['Effective/reference caffeine half-life',v15Number(input.subject.caffeineParameterMode==='direct effective half-life'?input.subject.caffeineHalfLifeH:input.subject.referenceCaffeineHalfLifeH)+' h'],
   ['Paraxanthine approximation',input.constants.paraxanthineApproximationEnabled?'Enabled':'Disabled'],['Optional ethanol-linked caffeine-clearance interaction',input.constants.optionalEthanolInhibitsCaffeineClearance?'Enabled':'Disabled']
  ]}/></Panel>
  {detail!=='default'&&flux&&<Panel title="Local appearance and elimination rates" kicker="Finite-interval estimates from dense state changes"><Table headers={['Quantity','Estimated rate','Unit']} rows={[
   ['Systemic ethanol appearance',v15Number(flux.ethanolSystemicAppearanceGPerH,5),'g/h'],['Ethanol elimination',v15Number(flux.ethanolEliminationGPerH,5),'g/h'],['Systemic caffeine appearance',v15Number(flux.caffeineSystemicAppearanceMgPerH,5),'mg/h'],['Caffeine elimination',v15Number(flux.caffeineEliminationMgPerH,5),'mg/h']
  ]}/><p className="v15-note">{flux.method} Interval width: {v15Number(flux.intervalH*60,4)} min.</p></Panel>}
  <Panel title="Definitions of the functional indices"><p>These dimensionless transforms describe the modelled exposure. Caffeine activation and perceived control cannot establish sobriety, psychomotor recovery or fitness to drive. The ethanol clearance equations have no caffeine term. The source model encodes no active exposure with zero-valued indices; the configured baseline terms operate inside the exposure-response calculation.</p><Table headers={['Index','Value on a 0–100 scale','Meaning']} rows={pd.filter(([,key])=>p?.[key]!==undefined).map(([label,key,definition])=>[label,v15Number(p[key]*100,3),definition])}/></Panel>
  <Panel title="Remove one intake counterfactual"><p>Evaluate the original accepted schedule against the same schedule after one intake is removed. This conditional difference includes shared nonlinear dynamics.</p>
   <div className="v15-actions"><label className="v15-field">Accepted intake<select value={eventId} onChange={e=>setEventId(e.target.value)}><option value="">Select an intake</option>{input.doseEvents.map(e=><option key={e.id} value={e.id}>{e.label||e.id} · {v15TimeLabel(e.startTimeH)}</option>)}</select></label><Button primary disabled={!current||busy||!eventId} onClick={evaluate}>{busy?'Evaluating…':'Evaluate removal'}</Button></div>
   {!current&&<p>Wait for a current accepted result before evaluating a counterfactual.</p>}
   {counter?.status==='valid'&&counter.inputKey===state.accepted?.numericalKey&&<><p>Removed: <strong>{counter.event.label}</strong>. Delta = remaining schedule minus original schedule.</p><Table headers={['Output','Original','Remaining schedule','Delta','Unit']} rows={v15MetricRows(counter.A.numerical,counter.B.numerical).map(x=>bacMetric(x,state.presentation)).map(x=>[x.label,v15Number(x.a,5),v15Number(x.b,5),v15Number(x.delta,5),x.unit])}/></>}
   {counter&&counter.status!=='valid'&&<p role="alert">Counterfactual status: {counter.status}. {counter.message}</p>}
  </Panel>
  {detail==='expert'&&<Panel title="Selected-time numerical provenance"><Button disabled={!current||science.status==='running'} onClick={()=>action(()=>science.run('convergence'))}>Compare with a refined solver step</Button>{science.status==='running'&&<Button onClick={()=>science.cancel()}>Cancel diagnostic</Button>}{convergence&&<details open><summary>{science.isCurrent(convergence)?'Current':'Previous'} convergence diagnostic</summary><p>{convergence.method} Internal steps {convergence.stepMin} and {convergence.refinedStepMin} min. Pre-clamp negative amounts: {convergence.preClampNegatives}.</p><Table headers={['Metric','Nominal','Refined','Change']} rows={Object.entries(convergence.metrics).map(([k,r])=>[k,r.nominal??r.nominalStatus??'Undefined',r.refined??r.refinedStatus??'Undefined',r.delta??'Unresolved'])}/></details>}<p>Current inspection is interpolated from the accepted dense trajectory. The original Expert workspace retains complete diagnostics and coefficient provenance.</p><pre className="v15-code">{JSON.stringify({snapshotId:snapshot.snapshotId,solver:result.solver,convergence:result.convergence,integrity:result.integrity,selectedPoint:p},null,2)}</pre></Panel>}
 </div>;
}
