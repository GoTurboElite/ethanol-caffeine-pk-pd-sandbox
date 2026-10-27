import {h,React,Fragment,bridge,controller,action,useSession,accepted,navigate} from './runtime.mjs';
import {Panel,Button,Table,Metric,Inspector,Intervals} from './common.jsx';
import {v15Stable,v15Diff,v15MetricRows,v15Number,v15Interpolate,v15TimeLabel,v15FormatInstant} from '../session/core.mjs';
import {bacText,bacUnit,bacValue} from './units.mjs';
export function V15Comparison(){
 const state=useSession(),[baseline,setBaseline]=React.useState('current'),enabled=state.document.comparisonEnabled;
 const inputKey=enabled?v15Stable(controller.comparisonInput()):'disabled';
 React.useEffect(()=>{if(enabled)controller.requestComparison();},[inputKey,enabled]);
 const value=controller.comparison;
 const refreshB=()=>action(()=>{
  const f=controller.capture(),d=f.document;
  d.comparisonScenarios.B={...d.mainScenario,id:'B',label:d.title||'Current scenario',notes:d.notes,calendarAnchorInstant:f.presentation.scenarioAnchorInstant,calendarTimeZone:f.presentation.scenarioTimeZone};
  d.comparisonBehaviourProfiles.B=d.behaviourProfile;
  controller.restore(f,'Refreshed comparison B');
 },'Scenario B refreshed from the current main scenario.');
 const ready=value?.status==='valid'&&value.key===inputKey;
 const profileDifferences=ready?v15Diff(value.input.profiles?.A??value.input.profile,value.input.profiles?.B??value.input.profile):[];
 const differences=ready?v15Diff(value.input.scenarios.A,value.input.scenarios.B).filter(x=>!['id','label','notes'].includes(x.path)):[];
 return <div className="v15-stack">
  <Panel title="Compare explicit input states" kicker="A/B analysis">
   <p>Build A from a saved state and B from the current main scenario. The comparison aligns elapsed time from each scenario’s model zero. Each captured calendar anchor is retained separately. Refresh B when you want to copy a subsequent main-scenario edit.</p>
   <div className="v15-actions"><label className="v15-field">Baseline for A<select value={baseline} onChange={e=>setBaseline(e.target.value)}><option value="current">Current main scenario</option>{controller.projects.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label><Button primary disabled={!controller.canSave()} onClick={()=>action(()=>controller.setBaseline(baseline),'Comparison inputs prepared.')}>Build comparison</Button><Button disabled={!enabled||!controller.canSave()} onClick={refreshB}>Refresh B from current</Button><Button onClick={()=>navigate('explore','compare')}>Open full comparison editor</Button></div>
  </Panel>
  {!enabled&&<Panel title="Choose a baseline"><p>Save a named state before changing an assumption, then build the comparison here.</p><Button onClick={()=>navigate('session','projects')}>Open Saved states</Button></Panel>}
  {enabled&&!ready&&<Panel title="Comparison calculation"><p role="status">{value?.status==='failed'?'Comparison failed: '+value.message:'Waiting for accepted A and B calculations.'}</p><Button onClick={()=>{controller.comparisonKey=null;action(()=>controller.requestComparison());}}>Retry comparison</Button></Panel>}
  {ready&&<><Panel title="Accepted comparison outputs"><p>A: <strong>{value.input.scenarios.A.label}</strong> · B: <strong>{value.input.scenarios.B.label}</strong></p><p className="v15-note">Delta = B minus A. Snapshots: {value.A.snapshotId} / {value.B.snapshotId}.</p><Table headers={['Output','A','B','Delta','Unit']} rows={v15MetricRows(value.A.numerical,value.B.numerical).concat([
    {label:'BAC area under curve',unit:'g·h/dL',a:value.A.numerical.summary.bacAucGdLH,b:value.B.numerical.summary.bacAucGdLH,delta:value.B.numerical.summary.bacAucGdLH-value.A.numerical.summary.bacAucGdLH},
    {label:'Caffeine area under curve',unit:'mg·h/L',a:value.A.numerical.summary.caffeineAucMgHL,b:value.B.numerical.summary.caffeineAucMgHL,delta:value.B.numerical.summary.caffeineAucMgHL-value.A.numerical.summary.caffeineAucMgHL}
   ]).map(x=>[x.label,v15Number(x.unit==='g/dL'?bacValue(x.a,state.presentation):x.a,5),v15Number(x.unit==='g/dL'?bacValue(x.b,state.presentation):x.b,5),v15Number(x.unit==='g/dL'?bacValue(x.delta,state.presentation):x.delta,5),x.unit==='g/dL'?bacUnit(state.presentation):x.unit])}/></Panel>
   <Panel title="Input differences">{differences.length?<Table headers={['Field','A','B']} rows={differences.map(x=>[x.path,typeof x.before==='object'?JSON.stringify(x.before):String(x.before??'—'),typeof x.after==='object'?JSON.stringify(x.after):String(x.after??'—')])}/>:<p>The kinetic input states match. Profile differences, when enabled, affect the downstream behavioural calculation.</p>}</Panel>
   <Panel title="Behavioural profile differences">{profileDifferences.length?<Table headers={['Field','A','B']} rows={profileDifferences.map(x=>[x.path,typeof x.before==='object'?JSON.stringify(x.before):String(x.before??'-'),typeof x.after==='object'?JSON.stringify(x.after):String(x.after??'-')])}/>:<p>Both sides use the same captured behavioural profile.</p>}</Panel>
   <Panel title="Comparison at the inspection time"><Inspector state={state} result={value.B.numerical}/><Table headers={['Scenario','BAC, '+bacUnit(state.presentation),'Caffeine, mg/L','Calendar instant','Coverage']} rows={['A','B'].map(side=>{const p=v15Interpolate(value[side].numerical.analysisPoints,state.presentation.selectedTimeH);return[side,p?bacText(p.bacGdL,state.presentation):'Outside coverage',p?v15Number(p.caffeineMgL,5):'Outside coverage',value.input.scenarios[side].calendarAnchorInstant?v15FormatInstant(Date.parse(value.input.scenarios[side].calendarAnchorInstant)+state.presentation.selectedTimeH*3600000,value.input.scenarios[side].calendarTimeZone||'UTC'):'Elapsed comparison; anchor not captured',v15Number(value[side].numerical.summary.horizonH)+' h'];})}/></Panel>
   <Panel title="A: complete threshold intervals"><Intervals result={value.A.numerical}/></Panel><Panel title="B: complete threshold intervals"><Intervals result={value.B.numerical}/></Panel>
  </>}
 </div>;
}
