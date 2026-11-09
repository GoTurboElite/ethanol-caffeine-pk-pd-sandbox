import {v15Interpolate,v15ChartSamples} from '../session/core.mjs';
export const ANALYTICAL_METHOD='Dense-trajectory piecewise-linear interpolation and trapezoidal integration; no extrapolation. The engine-refined global peak is retained when it lies inside the interval; other extrema use the dense trajectory.';
export const DIFFERENCE_METHOD='B − A on the union of dense time knots. Signed and absolute areas use compensated trapezoidal integration with exact window boundaries; sign-changing segments are split at the interpolated zero. Extrema use the first time in a tie.';
const ANALYTES=[['bac','bacGdL','g/dL','g·h/dL'],['caffeine','caffeineMgL','mg/L','mg·h/L']];
export const seriesOf=result=>result.analysisPoints?.length?result.analysisPoints:result.points;
export function timeWindow(start,end,horizon){
 start=Number(start);end=Number(end);
 if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end>horizon||end-start<1e-6*(1-1e-6))throw Error('Time bounds must increase within 0 to '+horizon+' h (minimum span 0.000001 h).');
 return {start,end};
}
export function windowPoints(points,start,end){
 if(!points?.length||!Number.isFinite(start)||!Number.isFinite(end)||start<points[0].tH||end>points.at(-1).tH||start>end)throw Error('Requested interval is outside trajectory coverage.');
 const a=v15Interpolate(points,start),b=v15Interpolate(points,end);
 return [a,...points.filter(p=>p.tH>start&&p.tH<end),...(end>start?[b]:[])];
}
function compensatedSum(){
 let value=0,correction=0;
 return {add(term){const adjusted=term-correction,next=value+adjusted;correction=(next-value)-adjusted;value=next;},get value(){return value;}};
}
const trapezoid=(a,b,width)=>(a+b)*.5*width;
export function exposure(result,start=0,end=seriesOf(result).at(-1).tH){
 const points=windowPoints(seriesOf(result),start,end),out={start,end,method:ANALYTICAL_METHOD};
 for(const [name,key,,unit]of ANALYTES){
  const auc=compensatedSum();
  let peak=points[0][key],peakTime=start,min=peak;
  for(let i=0;i<points.length;i++){const p=points[i];if(p[key]>peak){peak=p[key];peakTime=p.tH;}min=Math.min(min,p[key]);if(i){const a=points[i-1];auc.add(trapezoid(a[key],p[key],p.tH-a.tH));}}
  const refinedTime=result.summary?.[name==='bac'?'timeOfPeakBACH':'timeOfPeakCaffeineH'],refinedPeak=result.summary?.[name==='bac'?'peakBACGdL':'peakCaffeineMgL'];
  if(refinedTime>=start&&refinedTime<=end&&refinedPeak>=peak){peak=refinedPeak;peakTime=refinedTime;}
  out[name]={auc:auc.value,unit,peak,peakTime,min,final:points.at(-1)[key]};
 }
 out.thresholds=Object.fromEntries(['vehicleThresholdOutcome','legalThresholdOutcome','negligibleThresholdOutcome','caffeineDisplayThresholdOutcome'].filter(k=>result.summary?.[k]).map(k=>{const o=result.summary[k],windowEpisodes=o.intervals.filter(i=>i.endH>=start&&i.startH<=end).map(i=>{const a=Math.max(start,i.startH),b=Math.min(end,i.endH);return{...i,startH:a,endH:b,durationH:Math.max(0,b-a),boundaryContact:b===a,leftClipped:i.startH<start,rightClipped:i.endH>end};});return[k,{...o,windowEpisodes,windowExceedanceDurationH:windowEpisodes.reduce((s,i)=>s+i.durationH,0),finalReturnH:o.finalReturnH??null}];}));
 return out;
}
export const difference=(reference,experiment)=>({reference,experiment,absolute:experiment-reference,percent:reference===0?null:100*(experiment-reference)/Math.abs(reference)});
export function commonCoverage(a,b){
 const reference=seriesOf(a),experiment=seriesOf(b);
 return {start:Math.max(reference[0].tH,experiment[0].tH),end:Math.min(reference.at(-1).tH,experiment.at(-1).tH)};
}
export function differenceTrajectory(a,b){
 const {start,end}=commonCoverage(a,b),reference=windowPoints(seriesOf(a),start,end),experiment=windowPoints(seriesOf(b),start,end),points=[];
 let i=0,j=0;
 while(i<reference.length||j<experiment.length){
  const tH=Math.min(reference[i]?.tH??Infinity,experiment[j]?.tH??Infinity);
  const A=reference[i]?.tH===tH?reference[i++]:v15Interpolate(reference,tH);
  const B=experiment[j]?.tH===tH?experiment[j++]:v15Interpolate(experiment,tH);
  points.push({tH,bacGdL:B.bacGdL-A.bacGdL,caffeineMgL:B.caffeineMgL-A.caffeineMgL});
 }
 return points;
}
function differenceMetrics(points,key,unit,aucUnit){
 const signed=compensatedSum(),absolute=compensatedSum(),crossings=[],zeroIntervals=[];
 let positive=null,negative=null,previousSign=0,zeroStart=null;
 for(let i=0;i<points.length;i++){
  const point=points[i],value=point[key],sign=Math.sign(value),before=points[i-1];
  if(sign>0&&(!positive||value>positive.value))positive={time:point.tH,value};
  if(sign<0&&(!negative||value<negative.value))negative={time:point.tH,value};
  if(before){
   const prior=before[key],width=point.tH-before.tH;
   signed.add(trapezoid(prior,value,width));
   if(Math.sign(prior)*sign===-1){
    const fraction=Math.abs(prior)/(Math.abs(prior)+Math.abs(value));
    const time=before.tH+width*fraction;
    crossings.push({start:time,end:time});
    absolute.add(trapezoid(Math.abs(prior),0,width*fraction));
    absolute.add(trapezoid(0,Math.abs(value),width*(1-fraction)));
   }else absolute.add(trapezoid(Math.abs(prior),Math.abs(value),width));
  }
  if(!sign){
   zeroStart??=point.tH;
  }else{
   if(zeroStart!=null){
    const interval={start:zeroStart,end:before.tH};
    zeroIntervals.push(interval);
    if(previousSign&&previousSign!==sign)crossings.push(interval);
   }
   zeroStart=null;
   previousSign=sign;
  }
 }
 if(zeroStart!=null)zeroIntervals.push({start:zeroStart,end:points.at(-1).tH});
 return {signedAuc:signed.value,absoluteAuc:absolute.value,unit,aucUnit,positive,negative,crossings,zeroIntervals,identical:!positive&&!negative};
}
export function compareExposure(a,b,start=commonCoverage(a,b).start,end=commonCoverage(a,b).end,trajectory=differenceTrajectory(a,b)){
 const reference=exposure(a,start,end),experiment=exposure(b,start,end),rows=[];
 const clipped=windowPoints(trajectory,start,end),temporal={};
 for(const [analyte,field,unit,aucUnit] of ANALYTES){
  for(const key of ['peak','peakTime','auc','min','final'])rows.push({analyte,metric:key,unit:key==='peakTime'?'h':key==='auc'?aucUnit:unit,...difference(reference[analyte][key],experiment[analyte][key])});
  temporal[analyte]=differenceMetrics(clipped,field,unit,aucUnit);
 }
 return {start,end,referenceHorizon:seriesOf(a).at(-1).tH,experimentHorizon:seriesOf(b).at(-1).tH,rows,reference,experiment,temporal,method:ANALYTICAL_METHOD,differenceMethod:DIFFERENCE_METHOD};
}
export function niceTicks(min,max,count=4){
 if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min)throw Error('Axis bounds must be finite and increasing.');
 const raw=(max-min)/Math.max(1,count),power=10**Math.floor(Math.log10(raw)),fraction=raw/power,step=(fraction<=1?1:fraction<=2?2:fraction<=5?5:10)*power,out=[];
 for(let i=Math.ceil(min/step);i*step<=max+step*1e-10&&out.length<20;i++)out.push(Number((i*step).toPrecision(12)));
 return out.length>1?out:[min,max];
}
export function tickText(value){if(value===0)return '0';return Math.abs(value)<.001||Math.abs(value)>=1e5?value.toExponential(2):Number(value.toPrecision(5)).toString();}
export function displaySeries(result,start,end,max=700){return v15ChartSamples(windowPoints(seriesOf(result),start,end),max);}
