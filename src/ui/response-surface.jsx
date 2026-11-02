import {h} from './runtime.mjs';
import {tickText} from '../science/metrics.mjs';
export function ResponseSurface({rows,xValues,yValues,xLabel,yLabel,output,unit}){
 const values=rows.map(r=>r.value),low=Math.min(...values),high=Math.max(...values),value=(x,y)=>rows.find(r=>r.x===x&&r.y===y)?.value;
 return <div className="v15-table-scroll" tabIndex="0" role="region" aria-label={output+' response surface'}><table className="v230-surface"><caption>{output} ({unit}) · rows: {xLabel} · columns: {yLabel}. Shading is descriptive; every value is written explicitly.</caption><thead><tr><th scope="col">{xLabel} \ {yLabel}</th>{yValues.map(y=><th key={y} scope="col">{tickText(y)}</th>)}</tr></thead><tbody>{xValues.map(x=><tr key={x}><th scope="row">{tickText(x)}</th>{yValues.map(y=>{const v=value(x,y),fraction=high>low?(v-low)/(high-low):0;return <td key={y} style={{boxShadow:'inset 0 -'+Math.round(fraction*5+1)+'px var(--v160-accent)'}}>{Number.isFinite(v)?tickText(v):'Unavailable'}</td>;})}</tr>)}</tbody></table></div>;
}
