import {h,React,Fragment,bridge,controller,action,announce,useSession,accepted,navigate} from './runtime.mjs';
import {Panel,Button,Table,Metric,SnapshotNotice,Inspector,Intervals,EmptyResult,Disclosure} from './common.jsx';
import {v15Number,v15LocalInput,v15FormatInstant,v15LocalInstants,v15ResolveLocal,v15TimeLabel,v15Finite,v15Interpolate,v15ChartSamples} from '../session/core.mjs';
import {bacText,bacUnit} from './units.mjs';
import {v15CurveSVG} from './report.mjs';
function Calendar({state}){
 const p=state.presentation;
 const [local,setLocal]=React.useState(()=>v15LocalInput(p.scenarioAnchorInstant,p.scenarioTimeZone)),[zone,setZone]=React.useState(p.scenarioTimeZone),[occurrence,setOccurrence]=React.useState(''),[policy,setPolicy]=React.useState('elapsed');
 React.useEffect(()=>{setLocal(v15LocalInput(p.scenarioAnchorInstant,p.scenarioTimeZone));setZone(p.scenarioTimeZone);setOccurrence('');},[p.scenarioAnchorInstant,p.scenarioTimeZone]);
 let choices=[],message='';try{choices=v15LocalInstants(local,zone);message=choices.length===0?'This local time falls in a clock-change gap.':choices.length>1?'This clock time occurs twice; choose an occurrence.':'Corresponding instant: '+choices[0];}catch(error){message=error.message;}
 return <details className="v15-details" id="v160-calendar-anchor"><summary>Calendar anchor</summary><p>Model zero is the saved absolute instant corresponding to +0 h. The chosen time zone controls calendar presentation.</p>
  <div className="v15-form-grid"><label className="v15-field">Local date and time for model zero<input type="datetime-local" value={local} onChange={e=>{setLocal(e.target.value);setOccurrence('');}}/></label>
  <label className="v15-field">IANA time zone<input value={zone} onChange={e=>{setZone(e.target.value);setOccurrence('');}} placeholder="Europe/London"/></label>
  <label className="v15-field">Clock occurrence<select value={occurrence} onChange={e=>setOccurrence(e.target.value)} disabled={choices.length<2}><option value="">Choose if ambiguous</option><option value="earlier">Earlier occurrence</option><option value="later">Later occurrence</option></select></label>
  <label className="v15-field">Anchor-change policy<select value={policy} onChange={e=>setPolicy(e.target.value)}><option value="elapsed">Preserve elapsed schedule</option><option value="absolute">Preserve absolute event times</option></select></label></div>
  <p className="v15-note" role="status">{message}</p><Button onClick={()=>action(()=>controller.reanchor(v15ResolveLocal(local,zone,occurrence),zone,policy),'Calendar anchor applied.')}>Apply anchor</Button>
 </details>;
}
function EventEditor({state}){
 const d=state.document.mainScenario,[selected,setSelected]=React.useState([]),[shift,setShift]=React.useState('60');
 const items=[...d.doseEvents.map(e=>({type:'dose',key:'dose:'+e.id,event:e})),...(d.subject.mealEvents??[]).map(e=>({type:'meal',key:'meal:'+e.id,event:e}))].sort((a,b)=>a.event.startTimeH-b.event.startTimeH);
 const keys=items.map(x=>x.key).join('|');
 React.useEffect(()=>setSelected(old=>old.filter(k=>items.some(x=>x.key===k))),[keys]);
 const toggle=key=>setSelected(old=>old.includes(key)?old.filter(k=>k!==key):[...old,key]);
 const run=duplicate=>action(()=>controller.shift(selected,v15Finite(shift,'Shift minutes')/60,duplicate),duplicate?'Selected events duplicated.':'Selected events shifted.');
 return <Panel title="Draft schedule" kicker="Intakes and meals">
  <p>Amounts below include event servings. These controls edit the committed schedule; the accepted curve updates after recalculation.</p>
  <div className="v15-actions"><Button onClick={()=>setSelected(items.map(x=>x.key))}>Select all events</Button><Button onClick={()=>setSelected([])}>Clear selection</Button><Button onClick={()=>navigate('calculate')}>Edit amounts in Calculator</Button></div>
  <Table headers={['Select','Event','Start','Calendar start','Duration','Amount / state']} rows={items.map(({key,type,event:e})=>[
   <input aria-label={'Select '+(e.label||type)} type="checkbox" checked={selected.includes(key)} onChange={()=>toggle(key)}/>,
   <strong>{e.label||type}</strong>,
   <Button onClick={()=>action(()=>controller.inspect(e.startTimeH))}>{v15TimeLabel(e.startTimeH)}</Button>,
   v15FormatInstant(Date.parse(state.presentation.scenarioAnchorInstant)+e.startTimeH*3600000,state.presentation.scenarioTimeZone),
   v15Number(type==='dose'?e.durationMin:(e.durationH??0)*60)+' min',
   type==='dose'?v15Number((e.ethanolGrams||0)*(e.servings??1))+' g ethanol · '+v15Number((e.caffeineMg||0)*(e.servings??1))+' mg caffeine':e.foodState
  ])}/>
  {!items.length&&<p>No intake or meal events are present.</p>}
  <div className="v15-actions"><label className="v15-field">Signed shift, minutes<input aria-label="Signed shift minutes" type="number" step="1" value={shift} onChange={e=>setShift(e.target.value)}/></label><Button disabled={!selected.length} onClick={()=>run(false)}>Shift selected</Button><Button disabled={!selected.length} onClick={()=>run(true)}>Duplicate selected</Button><span>{selected.length} selected</span></div>
  <p className="v15-note">Positive shifts move events later; negative shifts move them earlier. Copies receive distinct identifiers and retain their amounts and durations.</p>
 </Panel>;
}
function Markers({state,result}){
 const [label,setLabel]=React.useState('Bedtime'),[kind,setKind]=React.useState('bedtime'),[time,setTime]=React.useState('12');
 return <Panel title="Analysis markers">
  <p>Inspect concentrations at a named time. A bedtime or waking marker adds a question to the trajectory; it does not introduce a sleep model.</p>
  <div className="v15-form-grid"><label className="v15-field">Marker label<input value={label} onChange={e=>setLabel(e.target.value)} maxLength="160"/></label><label className="v15-field">Marker kind<select value={kind} onChange={e=>setKind(e.target.value)}>{['bedtime','waking','activity','custom'].map(x=><option key={x} value={x}>{x}</option>)}</select></label><label className="v15-field">Marker elapsed hours<input type="number" value={time} step=".01" onChange={e=>setTime(e.target.value)}/></label><Button onClick={()=>action(()=>controller.addMarker({label,kind,timeH:v15Finite(time,'Marker time')}),'Analysis marker added.')}>Add marker</Button></div>
  {controller.markers.length>0&&<Table headers={['Marker','Elapsed time','BAC, '+bacUnit(state.presentation),'Caffeine, mg/L','Actions']} rows={controller.markers.map(m=>{const p=result?v15Interpolate(result.analysisPoints??result.points,m.timeH):null;return[m.label,v15TimeLabel(m.timeH),p?bacText(p.bacGdL,state.presentation):'Outside accepted coverage',p?v15Number(p.caffeineMgL,4):'Outside accepted coverage',<div className="v15-actions"><Button disabled={!p} onClick={()=>controller.inspect(m.timeH)}>Inspect</Button><Button onClick={()=>action(()=>controller.removeMarker(m.id),'Marker removed.')}>Remove</Button></div>];})}/>}
 </Panel>;
}
export function V15Timeline(){
 const state=useSession(),{result}=accepted(),p=state.presentation;
 const currentNow=(Date.now()-Date.parse(p.scenarioAnchorInstant))/3600000;
 return <div className="v15-stack">
  <Panel title="Session chronology"><div className="v160-section-heading"><span>Model zero: {v15FormatInstant(p.scenarioAnchorInstant,p.scenarioTimeZone)} · {p.scenarioTimeZone}</span><Button disabled={currentNow<0||currentNow>state.document.mainScenario.subject.simulationDurationH} onClick={()=>action(()=>controller.inspect(currentNow))}>Inspect current time</Button></div>
   <Calendar state={state}/>
   <Disclosure id="session-notes" title="Session title and notes"><div className="v15-form-grid"><label className="v15-field">Scenario title<input value={state.document.title} maxLength="500" onChange={e=>bridge.store.field('title',e.target.value)}/></label><label className="v15-field">Scenario notes<textarea value={state.document.notes} maxLength="20000" onChange={e=>bridge.store.field('notes',e.target.value)}/></label></div></Disclosure>
  </Panel>
  <EventEditor state={state}/>
  <Disclosure id="analysis-markers" title="Analysis markers" defaultOpen={state.presentation.detailMode!=='default'}><Markers state={state} result={result}/></Disclosure>
 </div>;
}
