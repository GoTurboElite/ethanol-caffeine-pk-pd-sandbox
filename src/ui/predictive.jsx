import {h,React,Fragment} from './runtime.mjs';
import {Table} from './common.jsx';
import {DiagnosticPlot} from './diagnostic-plot.jsx';
import {tickText} from '../science/metrics.mjs';
export function PredictiveSettings({value,onChange}){
 const setting=value??{model:'none',ethanol:0,caffeine:0},set=(k,v)=>onChange({...setting,[k]:v});
 return <fieldset><legend>Prospective observation error</legend><label className="v15-field">Observation model<select value={setting.model} onChange={e=>onChange({model:e.target.value,ethanol:0,caffeine:0})}><option value="none">Parameter variation only</option><option value="additive">Additive Gaussian error</option><option value="lognormal">Mean-preserving proportional lognormal error</option></select></label>{setting.model!=='none'&&<><div className="v230-window-controls">{['ethanol','caffeine'].map(k=><label className="v15-field" key={k}>{k} {setting.model==='additive'?'SD ('+(k==='ethanol'?'g/dL':'mg/L')+')':'coefficient of variation (fraction)'}<input type="number" min="0" step="any" value={setting[k]} onChange={e=>set(k,e.target.value)}/></label>)}</div><p>Errors are independent across times, analytes and paired scenarios. Each supplied scale describes one prospective measurement. Additive errors can yield negative readings. The proportional model preserves a zero baseline.</p></>}</fieldset>;
}
export function PredictiveResults({result}){
 const [analyte,setAnalyte]=React.useState('caffeine'),[side,setSide]=React.useState('A');
 if(!result.predictiveGrid)return null;
 const group=result.paired?side:'A',rows=result.predictiveGrid,unit=analyte==='bac'?'g/dL':'mg/L';
 return <details><summary>Prospective measurement quantiles</summary><p>Conditional pointwise Monte Carlo quantiles, including the configured observation error. Concentration peaks and threshold results use the latent trajectories.</p><label className="v15-field">Measurement analyte<select value={analyte} onChange={e=>setAnalyte(e.target.value)}><option value="bac">Ethanol</option><option value="caffeine">Caffeine</option></select></label>{result.paired&&<label className="v15-field">Paired measurement output<select value={side} onChange={e=>setSide(e.target.value)}>{['A','B','difference'].map(s=><option key={s}>{s}</option>)}</select></label>}<DiagnosticPlot title="Prospective measurement median" xLabel="Elapsed hours" yLabel={unit} line points={rows.map(p=>({x:p.tH,y:p[group][analyte].p50}))}/><Table caption={'Pointwise measurements in '+unit} headers={['Hours','P05','P50','P95']} rows={rows.map(p=>[p.tH,...['p05','p50','p95'].map(q=>tickText(p[group][analyte][q]))])}/></details>;
}
