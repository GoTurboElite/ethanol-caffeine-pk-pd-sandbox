import {h,React} from './runtime.mjs';
import {niceTicks,tickText} from '../science/metrics.mjs';
export function DiagnosticPlot({points,xLabel,yLabel,title,line=false,onPoint,selectedId}){
 const finite=points.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));if(!finite.length)return <p>No defined values for {title}.</p>;
 let xmin=Math.min(...finite.map(p=>p.x)),xmax=Math.max(...finite.map(p=>p.x)),ymin=Math.min(0,...finite.map(p=>p.y)),ymax=Math.max(0,...finite.map(p=>p.y));if(xmax===xmin)xmax=xmin+1;if(ymax===ymin)ymax=ymin+1;const x=v=>65+590*(v-xmin)/(xmax-xmin),y=v=>190-150*(v-ymin)/(ymax-ymin);
 return <figure className="v230-diagnostic"><figcaption>{title}</figcaption><svg viewBox="0 0 720 244" role="img" aria-label={title+'; '+xLabel+' versus '+yLabel+'. Exact values are in the associated table.'}><text x="65" y="18">{yLabel}</text>{niceTicks(ymin,ymax).map(v=><g key={v}><line x1="65" x2="655" y1={y(v)} y2={y(v)} className="v160-grid-line"/><text x="58" y={y(v)+4} textAnchor="end">{tickText(v)}</text></g>)}{niceTicks(xmin,xmax).map(v=><text key={v} x={x(v)} y="210" textAnchor="middle">{tickText(v)}</text>)}<text x="360" y="237" textAnchor="middle">{xLabel}</text>{line&&<path d={finite.map((p,i)=>(i?'L':'M')+x(p.x)+','+y(p.y)).join(' ')} fill="none" stroke="currentColor" strokeWidth="2"/>}{finite.map((p,i)=><g key={p.id??i}>
  <circle cx={x(p.x)} cy={y(p.y)} r={p.id&&p.id===selectedId?6:3.5} fill="var(--v160-surface)" stroke="currentColor"><title>{p.label??''}: {tickText(p.x)}, {tickText(p.y)}</title></circle>
  {onPoint&&<circle className="v240-point-target" cx={x(p.x)} cy={y(p.y)} r="10" fill="transparent" data-observation-id={p.id} onClick={()=>onPoint(p.id)}/>}
 </g>)}</svg></figure>;
}
