import {h,React,Fragment,bridge,controller,action,navigate} from './runtime.mjs';
import {v15Number,v15FormatInstant,v15TimeLabel,v15Interpolate} from '../session/core.mjs';
export function Button({children,onClick,primary=false,...props}){return <button type="button" className={'v15-button'+(primary?' primary':'')} onClick={onClick} {...props}>{children}</button>;}
export function Panel({title,kicker,children,className='',...props}){return <section className={'v15-panel '+className} {...props}>{kicker&&<p className="v15-kicker">{kicker}</p>}{title&&<h2>{title}</h2>}{children}</section>;}
export function Table({headers,rows,caption}){return <div className="v15-table-scroll"><table>{caption&&<caption>{caption}</caption>}<thead><tr>{headers.map(x=><th key={x} scope="col">{x}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;}
export function Metric({label,value,unit,sub}){return <div className="v15-metric"><span>{label}</span><strong>{value}<small>{unit}</small></strong>{sub&&<small>{sub}</small>}</div>;}
export function SnapshotNotice({state,snapshot}){
 const relation=state.snapshots.relationToDraft;
 return <div className={'v15-snapshot '+(relation==='current'?'current':'stale')} role="status"><strong>{relation==='current'?'Current accepted result':snapshot?'Previous accepted result':'Calculation pending'}</strong><span>{snapshot?'Snapshot '+snapshot.snapshotId:'Enter valid inputs and run the calculation.'}</span>{relation!=='current'&&<span>Committed draft changes are awaiting a matching accepted calculation.</span>}</div>;
}
export function Inspector({state,result}){
 const t=state.presentation.selectedTimeH,end=state.document.mainScenario.subject.simulationDurationH,p=result?v15Interpolate(result.analysisPoints??result.points,t):null;
 return <div className="v15-inspector">
  <label className="v15-field v15-slider">Inspection time<input aria-label="Inspection time slider" type="range" min="0" max={end} step=".01" value={Math.min(end,Math.max(0,t))} onChange={e=>action(()=>controller.inspect(Number(e.target.value)))}/></label>
  <label className="v15-field">Elapsed hours<input aria-label="Inspection elapsed hours" type="number" min="0" max={end} step=".01" value={Number(t.toFixed(4))} onChange={e=>{if(e.target.value!=='')action(()=>controller.inspect(Number(e.target.value)));}}/></label>
  <div className="v15-inspection-time"><strong>{v15TimeLabel(t)}</strong><span>{v15FormatInstant(Date.parse(state.presentation.scenarioAnchorInstant)+t*3600000,state.presentation.scenarioTimeZone)}</span></div>
  {p&&<div className="v15-inline-values"><span>BAC <b>{v15Number(p.bacGdL,5)}</b> g/dL</span><span>Caffeine <b>{v15Number(p.caffeineMgL,4)}</b> mg/L</span></div>}
 </div>;
}
export function Intervals({result}){
 const rows=[];
 for(const [label,key]of[['Vehicle reference','vehicleThresholdOutcome'],['Comparison reference','legalThresholdOutcome'],['Negligible BAC','negligibleThresholdOutcome']]){
  const out=result.summary[key];if(!out)continue;
  if(!out.intervals.length)rows.push([label,v15Number(out.threshold,4),'Never exceeded','—','—']);
  else out.intervals.forEach((i,n)=>rows.push([label+' · '+(n+1),v15Number(out.threshold,4),v15TimeLabel(i.startH)+(i.leftCensored?' · active at start':''),v15TimeLabel(i.endH)+(i.rightCensored?' · open at horizon':''),out.finalReturnH===undefined?'Not observed':v15TimeLabel(out.finalReturnH)]));
 }
 return <Table headers={['Reference / interval','g/dL','Start','End','Final return in schedule']} rows={rows}/>;
}
export function EmptyResult(){return <Panel title="A calculation is required"><p>Open Calculator, finish the inputs and wait for an accepted result.</p><Button primary onClick={()=>navigate('calculate')}>Open Calculator</Button></Panel>;}
