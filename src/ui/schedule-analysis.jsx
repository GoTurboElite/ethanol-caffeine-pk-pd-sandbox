import {h,React,Fragment,bridge} from './runtime.mjs';
import {Table} from './common.jsx';
import {scheduleRows,scheduleTotals,alignedSchedule} from '../science/schedule.mjs';
import {tickText} from '../science/metrics.mjs';
const fmt=tickText;
export function ScheduleAnalysis({input,other,start,end,onInspect}){
 const rows=React.useMemo(()=>scheduleRows(bridge.scienceCore,input),[input]);
 const compared=React.useMemo(()=>other?alignedSchedule(rows,scheduleRows(bridge.scienceCore,other)):[],[rows,other]);
 const totals=r=>{const t=scheduleTotals(r,start,end);return fmt(t.ethanolG)+' g ethanol · '+fmt(t.caffeineMg)+' mg caffeine · '+t.count+' intakes · '+fmt(t.activeMinutes)+' min of administration'+(t.minSpacingH==null?'':' · shortest start spacing '+fmt(t.minSpacingH)+' h');};
 const cell=r=>r?<><button className="v160-link" disabled={r.start<(start??-Infinity)||r.start>(end??Infinity)} onClick={()=>onInspect(r.start)}>{fmt(r.start)} h</button> to {fmt(r.end)} h · {r.kind==='Meal'?r.food:fmt(r.ethanol)+' g / '+fmt(r.caffeine)+' mg'}</>:'Absent';
 return <details className="v15-details"><summary>{other?'Aligned reference and experimental schedules':'Administered dose and timing'}</summary><p>{Number.isFinite(start)?'Window '+fmt(start)+'–'+fmt(end)+' h. ':'Whole schedule. '}{other?'Reference A: ':''}{totals(rows)}.</p>{other&&<><p>Experiment B: {totals(scheduleRows(bridge.scienceCore,other))}.</p><Table caption="Chronology on a common elapsed-time axis" headers={['Event','Reference A','Experiment B','Changes']} rows={compared.map(r=>[r.b?.label||r.a?.label||r.key,cell(r.a),cell(r.b),r.changes.join(', ')||'Unchanged'])}/></>}<p>Overlapping administration minutes count once. Continuous doses are prorated by overlap. Instantaneous doses at either window boundary are included.</p></details>;
}
