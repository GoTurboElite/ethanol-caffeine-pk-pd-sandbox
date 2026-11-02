import {v15Interpolate,v15ChartSamples} from '../session/core.mjs';
export const ANALYTICAL_METHOD='Dense-trajectory piecewise-linear interpolation and trapezoidal integration; no extrapolation. The engine-refined global peak is retained when it lies inside the interval; other extrema use the dense trajectory.';
export const seriesOf=result=>result.analysisPoints?.length?result.analysisPoints:result.points;
export function timeWindow(start,end,horizon){
 start=Number(start);end=Number(end);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end>horizon||end-start<1e-6*(1-1e-6))throw Error('Time bounds must increase within 0 to '+horizon+' h (minimum span 0.000001 h).');
 return {start,end};
}
export function windowPoints(points,start,end){
 if(!points?.length||start<points[0].tH-1e-10||end>points.at(-1).tH+1e-10||start>end)throw Error('Requested interval is outside trajectory coverage.');
 const a=v15Interpolate(points,start),b=v15Interpolate(points,end);
 return [a,...points.filter(p=>p.tH>start&&p.tH<end),...(end>start?[b]:[])];
}
export function exposure(result,start=0,end=seriesOf(result).at(-1).tH){
 const points=windowPoints(seriesOf(result),start,end),out={start,end,method:ANALYTICAL_METHOD};
 for(const [name,key,unit]of [['bac','bacGdL','g·h/dL'],['caffeine','caffeineMgL','mg·h/L']]){
  let auc=0,correction=0,peak=points[0][key],peakTime=start,min=peak;
  for(let i=0;i<points.length;i++){const p=points[i];if(p[key]>peak){peak=p[key];peakTime=p.tH;}min=Math.min(min,p[key]);if(i){const a=points[i-1],term=(a[key]+p[key])*.5*(p.tH-a.tH)-correction,next=auc+term;correction=(next-auc)-term;auc=next;}}
  const refinedTime=result.summary?.[name==='bac'?'timeOfPeakBACH':'timeOfPeakCaffeineH'],refinedPeak=result.summary?.[name==='bac'?'peakBACGdL':'peakCaffeineMgL'];
  if(refinedTime>=start&&refinedTime<=end&&refinedPeak>=peak){peak=refinedPeak;peakTime=refinedTime;}
  out[name]={auc,unit,peak,peakTime,min,final:points.at(-1)[key]};
 }
 out.thresholds=Object.fromEntries(['vehicleThresholdOutcome','legalThresholdOutcome','negligibleThresholdOutcome','caffeineDisplayThresholdOutcome'].filter(k=>result.summary?.[k]).map(k=>{const o=result.summary[k],windowEpisodes=o.intervals.filter(i=>i.endH>=start&&i.startH<=end).map(i=>{const a=Math.max(start,i.startH),b=Math.min(end,i.endH);return{...i,startH:a,endH:b,durationH:Math.max(0,b-a),boundaryContact:b===a,leftClipped:i.startH<start,rightClipped:i.endH>end};});return[k,{...o,windowEpisodes,windowExceedanceDurationH:windowEpisodes.reduce((s,i)=>s+i.durationH,0),finalReturnH:o.finalReturnH??null}];}));
 return out;
}
export const difference=(reference,experiment)=>({reference,experiment,absolute:experiment-reference,percent:reference===0?null:100*(experiment-reference)/Math.abs(reference)});
export function compareExposure(a,b,start=0,end=Math.min(seriesOf(a).at(-1).tH,seriesOf(b).at(-1).tH)){
 const reference=exposure(a,start,end),experiment=exposure(b,start,end),rows=[];
 for(const analyte of ['bac','caffeine'])for(const key of ['peak','peakTime','auc','min','final'])rows.push({analyte,metric:key,unit:key==='peakTime'?'h':key==='auc'?reference[analyte].unit:analyte==='bac'?'g/dL':'mg/L',...difference(reference[analyte][key],experiment[analyte][key])});
 return {start,end,referenceHorizon:seriesOf(a).at(-1).tH,experimentHorizon:seriesOf(b).at(-1).tH,rows,reference,experiment,method:ANALYTICAL_METHOD};
}
export function niceTicks(min,max,count=4){
 if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min)throw Error('Axis bounds must be finite and increasing.');
 const raw=(max-min)/Math.max(1,count),power=10**Math.floor(Math.log10(raw)),fraction=raw/power,step=(fraction<=1?1:fraction<=2?2:fraction<=5?5:10)*power,out=[];
 for(let i=Math.ceil(min/step);i*step<=max+step*1e-10&&out.length<20;i++)out.push(Number((i*step).toPrecision(12)));
 return out.length>1?out:[min,max];
}
export function tickText(value){if(value===0)return '0';return Math.abs(value)<.001||Math.abs(value)>=1e5?value.toExponential(2):Number(value.toPrecision(5)).toString();}
export function displaySeries(result,start,end,max=700){return v15ChartSamples(windowPoints(seriesOf(result),start,end),max);}
