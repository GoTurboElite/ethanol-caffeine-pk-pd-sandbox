import {h,React,Fragment,bridge} from './runtime.mjs';
import {Table} from './common.jsx';
import {DiagnosticPlot} from './diagnostic-plot.jsx';
import {mechanismAt,mechanismContext,quantities} from '../science/mechanism.mjs';
import {tickText} from '../science/metrics.mjs';

const fmt=n=>Number.isFinite(n)?tickText(n):'Undefined';
export function Mechanism({input,result,otherInput,otherResult,time,start=0,end,onInspect,depth}){
 const [open,setOpen]=React.useState(false),[field,setField]=React.useState('ethanolAppearance');
 const context=React.useMemo(()=>open?mechanismContext(bridge.scienceCore,input,result):null,[open,input,result]);
 const other=React.useMemo(()=>open&&otherInput&&otherResult?mechanismContext(bridge.scienceCore,otherInput,otherResult):null,[open,otherInput,otherResult]);
 const selected=context&&mechanismAt(context,time),second=other&&mechanismAt(other,time);
 const chart=React.useMemo(()=>{
  if(!context||depth==='default')return [];
  const sampleTimes=new Set(Array.from({length:97},(_,i)=>i===96?end:start+(end-start)*i/96));
  for(const c of [context,other].filter(Boolean))for(const d of [...c.doses,...c.meals.map(m=>({startH:m.startTimeH,endH:m.startTimeH+m.durationH}))])for(const t of [d.startH,d.endH])if(t>=start&&t<=end)sampleTimes.add(t);
  return [...sampleTimes].sort((a,b)=>a-b).map(x=>({x,y:mechanismAt(context,x)?.values[field],other:other?mechanismAt(other,x)?.values[field]:null}));
 },[context,other,depth,field,start,end]);
 const amount=(name,unit)=>fmt(selected?.values[name])+' '+unit;
 return <details className="v15-details" onToggle={e=>setOpen(e.currentTarget.open)}><summary>Compartment and flux inspector</summary>{selected&&<>
 <p>At {fmt(time)} h, {amount('ethanolAppearance','g/h')} of ethanol and {amount('caffeineAppearance','mg/h')} of caffeine enter the systemic compartments. The elimination rates are {amount('ethanolElimination','g/h')} and {amount('caffeineElimination','mg/h')}.</p>
 {selected.boluses.length>0&&<p>Instantaneous oral doses at the cursor: {selected.boluses.map(d=>fmt(d.ethanolG)+' g ethanol and '+fmt(d.caffeineMg)+' mg caffeine').join(', ')}.</p>}
 {depth!=='default'&&<><p>Oral ethanol → gastric pool → intestinal pool. Uptake from both pools passes through first-pass extraction before entering systemic distribution. Oral caffeine → gut → systemic distribution → elimination, with optional metabolite formation.</p>
 <div className="v250-flows" aria-label="Compartment transfer diagram"><div><strong>Gastric ethanol · {amount('gastricEthanolG','g')}</strong><span>↓ emptying {amount('emptying','g/h')}</span><strong>Intestinal ethanol · {amount('intestinalEthanolG','g')}</strong><span>Gastric and intestinal uptake → first-pass loss {amount('firstPass','g/h')}</span><span>↓ systemic appearance {amount('ethanolAppearance','g/h')}</span><strong>Systemic ethanol · {amount('centralEthanolG','g')}</strong><span>↓ elimination {amount('ethanolElimination','g/h')}</span></div><div><strong>Gut caffeine · {amount('caffeineGutMg','mg')}</strong><span>↓ absorption {amount('caffeineAppearance','mg/h')}</span><strong>Systemic caffeine · {amount('caffeineCentralMg','mg')}</strong><span>↓ parent clearance {amount('caffeineElimination','mg/h')}</span>{context.constants.paraxanthineApproximationEnabled&&<><span>Metabolite formation {amount('metaboliteFormation','mg/h')}</span><strong>Paraxanthine · {amount('paraxanthineCentralMg','mg')}</strong></>}</div></div>
 <Table caption="State and transfer rates at the inspection time" headers={['Quantity','Reference / selected',...(second?['Experimental']:[]),'Unit']} rows={Object.entries(quantities).filter(([k])=>selected.values[k]!=null||second?.values[k]!=null).map(([k,[label,unit]])=>[label,fmt(selected.values[k]),...(second?[fmt(second.values[k])]:[]),unit])}/>
 <label className="v15-field">Mechanistic trajectory<select value={field} onChange={e=>setField(e.target.value)}>{Object.entries(quantities).filter(([k])=>selected.values[k]!=null||second?.values[k]!=null).map(([k,[label,unit]])=><option key={k} value={k}>{label} ({unit})</option>)}</select></label>
 <DiagnosticPlot title={quantities[field][0]+' over the selected window'} xLabel="Elapsed hours" yLabel={quantities[field][1]} points={chart.map(p=>({...p,id:String(p.x)}))} onPoint={id=>onInspect(Number(id))} line/>
 {second&&<DiagnosticPlot title={'Experimental '+quantities[field][0].toLowerCase()} xLabel="Elapsed hours" yLabel={quantities[field][1]} points={chart.map(p=>({x:p.x,y:p.other,id:String(p.x)}))} onPoint={id=>onInspect(Number(id))} line/>}
 <p>Display samples include event boundaries. Connecting lines guide inspection. The numerical inspector evaluates the selected time directly.</p>
 <Table caption="Mass conservation at the cursor" headers={['Analyte','Initial','Administered since earliest event','Signed residual','Absolute residual','Relative residual','Unit']} rows={['ethanol','caffeine'].map(k=>{const d=selected[k];return[k,fmt(d.initialMass),fmt(d.administered),fmt(d.residual),fmt(d.absoluteResidual),fmt(d.relativeResidual),d.unit];})}/>
 <p>Cumulative systemic appearance is {fmt(selected.cumulative.systemicEthanolAbsorbedG)} g ethanol and {fmt(selected.cumulative.systemicCaffeineAbsorbedMg)} mg caffeine. Caffeine k = {fmt(selected.caffeineKPerH)} h⁻¹, apparent Vd = {fmt(selected.caffeineVdL)} L and instantaneous clearance = {fmt(selected.caffeineClearanceLPerH)} L/h.</p></>}
 {depth==='expert'&&<><p>dAcentral/dt = systemic appearance − elimination. Michaelis–Menten elimination = resolved Vmax × clearance modifier × BAC/(Km + BAC). Zero-order clearance is capacity-limited at depletion. Caffeine elimination = k × central mass, with k based on ln(2)/half-life and any active clearance modifiers. The caffeine balance uses molar-equivalent metabolite masses.</p><p>{selected.method}</p><details><summary>Compartment and sink ledgers</summary><pre className="v15-code">{JSON.stringify({ethanol:selected.ethanol,caffeine:selected.caffeine},null,2)}</pre></details></>}
 </>}</details>;
}
