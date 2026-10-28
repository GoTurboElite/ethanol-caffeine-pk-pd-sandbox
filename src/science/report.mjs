import {v15Escape as esc,v15Number as num} from '../session/core.mjs';
import {scienceInputKey} from './schema.mjs';
export function scientificReport(frame,records=[],depth='default'){
 if(!records.length&&!frame.science?.observations?.length)return '';
 let out='<h2>Scientific workbench</h2><p>Model profile: reference-1.60; engine 0.4.4; constants 0.3.0. Scientific records retain their captured input and evidence identity.</p>';
 if(frame.science?.observations?.length)out+='<p>Observation dataset: '+frame.science.observations.length+' rows. '+esc(frame.science.observationSource)+'</p>';
 const key=frame.science?scienceInputKey(frame.document.mainScenario,frame.science,frame.science.uncertainty.paired&&frame.document.comparisonEnabled?frame.document.comparisonScenarios:null):'';
 for(const r of records){out+='<h3>'+esc(r.kind)+' - '+esc(r.computedAt)+'</h3><p>Input relation: '+(r.sourceKey===key?'matches the report scientific inputs':'retained result with independently captured inputs')+'. Source fingerprint: '+esc(r.releaseFingerprint)+'.</p>';
  if(r.assumptions)out+='<p>'+esc(r.assumptions)+'</p>';
  if(r.kind==='fit')out+='<pre>'+esc(JSON.stringify({values:r.values,identifiable:r.identifiable,atBounds:r.atBounds,converged:r.converged,supportInterval:r.supportInterval},null,2))+'</pre>';
  if(r.metrics)out+='<pre>'+esc(JSON.stringify(r.metrics,null,2))+'</pre>';
  if(r.kind==='uncertainty'&&r.grid){
   for(const [field,label,unit]of[['bac','BAC','g/dL'],['caffeine','Caffeine','mg/L']]){const max=Math.max(field==='bac'?.001:.1,...r.grid.map(p=>p[field].p95))*1.1,end=r.grid.at(-1).tH||1,x=t=>60+820*t/end,y=v=>145-120*v/max,line=q=>r.grid.map((p,i)=>(i?'L':'M')+x(p.tH).toFixed(2)+','+y(p[field][q]).toFixed(2)).join(' '),area=line('p95')+[...r.grid].reverse().map(p=>'L'+x(p.tH).toFixed(2)+','+y(p[field].p05).toFixed(2)).join(' ')+'Z';out+='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 195" role="img" aria-label="Sampled '+label+' P05-P95 band and P50 in '+unit+'"><title>'+label+' conditional quantiles in '+unit+'</title><text x="60" y="16">'+label+' '+unit+'; P50 line and P05-P95 band</text><path d="'+area+'" fill="#526f91" opacity=".18"/><path d="'+line('p50')+'" fill="none" stroke="#295776" stroke-width="2.5"/><text x="5" y="30">'+num(max,3)+'</text><text x="35" y="148">0</text><text x="60" y="180">0 h</text><text x="840" y="180">'+num(end)+' h</text></svg>';}out+='<pre>'+esc(JSON.stringify({seed:r.seed,samples:r.samples,threshold:r.threshold,deltas:r.deltas},null,2))+'</pre>';
  }
  if(r.kind==='benchmarks')out+='<p>'+esc(r.criteria)+'</p><table><thead><tr><th>Cohort</th><th>Observed Cmax</th><th>Predicted Cmax</th><th>Units</th><th>Difference / SD</th></tr></thead><tbody>'+r.rows.map(b=>'<tr><td>'+esc(b.cohort)+'</td><td>'+num(b.observed,5)+'</td><td>'+num(b.predicted,5)+'</td><td>'+esc(b.unit)+'</td><td>'+num(b.standardizedError,3)+'</td></tr>').join('')+'</tbody></table>';
  if(depth==='expert')out+='<h4>Captured scientific record</h4><pre>'+esc(JSON.stringify(r,null,2))+'</pre>';
 }return out;
}
