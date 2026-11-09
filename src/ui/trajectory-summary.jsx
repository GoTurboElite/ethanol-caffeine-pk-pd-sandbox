import {h,Fragment} from './runtime.mjs';
import {Disclosure,Table} from './common.jsx';
import {tickText} from '../science/metrics.mjs';
import {bacMetric,bacUnit,bacValue} from './units.mjs';

const analytes=[['bac','BAC'],['caffeine','Caffeine']];
const thresholdLabels={vehicleThresholdOutcome:'BAC reference',legalThresholdOutcome:'BAC legal reference',negligibleThresholdOutcome:'BAC negligible reference',caffeineDisplayThresholdOutcome:'Caffeine reference'};
const sustained=outcome=>outcome.windowEpisodes.filter(episode=>!episode.boundaryContact).length;
const status=outcome=>outcome.rightCensored?'Unresolved at horizon':outcome.status==='never-exceeded'?'Never exceeded':Number.isFinite(outcome.finalReturnH)?tickText(outcome.finalReturnH)+' h':'Not observed';
const signed=value=>(value>0?'+':'')+tickText(value);
const period=({start,end})=>start===end?tickText(start):tickText(start)+'–'+tickText(end);

export function TrajectorySummary({value,full,presentation,onInspect}){
 const depth=presentation.detailMode;
 const convert=(analyte,n)=>analyte==='bac'?bacValue(n,presentation):n;
 const concentrationUnit=analyte=>analyte==='bac'?bacUnit(presentation):'mg/L';
 const areaUnit=analyte=>bacMetric({unit:value.temporal[analyte].aucUnit},presentation).unit;
 const peak=(analyte,ex)=>{
  const {peak,peakTime,min}=ex[analyte],value=tickText(convert(analyte,peak))+' '+concentrationUnit(analyte);
  return peak===min?value+' throughout':value+' at '+tickText(peakTime)+' h';
 };
 const area=(analyte,n)=>tickText(convert(analyte,n))+' '+areaUnit(analyte);
 const extreme=(analyte,item)=>item?<button type="button" className="v160-link" aria-label={'Inspect '+analyte+' difference at '+tickText(item.time)+' h'} onClick={()=>onInspect(item.time)}>{signed(convert(analyte,item.value))} {concentrationUnit(analyte)} at {tickText(item.time)} h</button>:'None';
 return <section className="v240-summary" aria-label="Comparative analytical summary">
  <h3>Comparative analytical summary</h3>
  <p>Selected common window {period(value)} h. Positive differences indicate higher concentrations in B. Absolute divergence measures the separation in either direction over time.</p>
  <dl className="v240-results">{analytes.map(([analyte,label])=>{
   const d=value.temporal[analyte],largest=[d.positive,d.negative].filter(Boolean).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value)||a.time-b.time)[0];
   return <div key={analyte}><dt>{label}</dt><dd>A peak {peak(analyte,value.reference)} · B peak {peak(analyte,value.experiment)}</dd><dd>A exposure {area(analyte,value.reference[analyte].auc)} · B exposure {area(analyte,value.experiment[analyte].auc)}</dd><dd>Signed ΔAUC <b>{signed(convert(analyte,d.signedAuc))} {areaUnit(analyte)}</b> · Absolute divergence <b>{area(analyte,d.absoluteAuc)}</b></dd><dd>{d.identical?'Identical throughout this window':<>Largest concentration difference {extreme(analyte,largest)}</>}</dd></div>;
  })}</dl>
  <Disclosure id="window-exposure-reference" title="Window exposure and extrema" defaultOpen={depth!=='default'}>
   <Table caption="Selected-window trajectory differences" headers={['Analyte / metric','Reference A','Experiment B','Signed difference','Relative difference','Unit']} rows={value.rows.map(r=>{
    const display=bacMetric({a:r.reference,b:r.experiment,delta:r.absolute,unit:r.unit},presentation);
    return [r.analyte+' / '+r.metric,tickText(display.a),tickText(display.b),signed(display.delta),r.percent==null?'Undefined (zero reference)':tickText(r.percent)+'%',display.unit];
   })}/>
   <Table caption="Selected-window temporal differences" headers={['Analyte','Maximum positive','Most negative','Sign reversals (h)']} rows={analytes.map(([analyte,label])=>{
    const d=value.temporal[analyte];
    return [label,extreme(analyte,d.positive),extreme(analyte,d.negative),d.identical?'Zero throughout':d.crossings.map(period).join(', ')||'None'];
   })}/>
   <Table caption="Selected-window threshold episode differences" headers={['Reference','A / B level','A / B sustained episodes','A / B boundary contacts','A / B duration (h)','B − A duration (h)']} rows={Object.entries(value.reference.thresholds).flatMap(([key,a])=>{
    const b=value.experiment.thresholds[key];
    if(!b)return [];
    const analyte=key.startsWith('caffeine')?'caffeine':'bac';
    const count=o=>o.windowEpisodes.length-sustained(o);
    return [[thresholdLabels[key],tickText(convert(analyte,a.threshold))+' / '+tickText(convert(analyte,b.threshold))+' '+concentrationUnit(analyte),sustained(a)+' / '+sustained(b),count(a)+' / '+count(b),tickText(a.windowExceedanceDurationH)+' / '+tickText(b.windowExceedanceDurationH),a.threshold===b.threshold?signed(b.windowExceedanceDurationH-a.windowExceedanceDurationH):'Different levels']];
   })}/>
   {depth==='expert'&&<><p>{value.method} {value.differenceMethod}</p><p>Zero contacts and intervals without sign reversal remain separate from crossings. A crossing through a zero plateau is reported as a time range. Exact zero contacts and the canonical-unit results are included in the analytical view export.</p></>}
  </Disclosure>
  <details open={value.referenceHorizon!==value.experimentHorizon||undefined}>
   <summary>Full-horizon exposure and threshold status</summary>
   <Table caption="Separate full-horizon exposure" headers={['Trajectory','Horizon (h)','BAC AUC','Caffeine AUC']} rows={full.map(([label,ex])=>[label,tickText(ex.end),area('bac',ex.bac.auc),area('caffeine',ex.caffeine.auc)])}/>
   <Table caption="Full-horizon threshold status by trajectory" headers={['Trajectory / reference','Final return']} rows={full.flatMap(([label,ex])=>Object.entries(ex.thresholds).map(([key,o])=>[label+' / '+thresholdLabels[key],status(o)]))}/>
  </details>
 </section>;
}
