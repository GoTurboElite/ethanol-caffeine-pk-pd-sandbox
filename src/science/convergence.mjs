import {v15Interpolate} from '../session/core.mjs';
export function inspectConvergence(core,input,nominal,times){
 const {subject,constants,doseEvents}=input,step=nominal.solver.internalStepMin,refinedStep=step/2;
 const earliest=Math.min(0,...doseEvents.map(e=>e.startTimeH),...(subject.mealEvents??[]).map(e=>e.startTimeH));
 if((subject.simulationDurationH-earliest)*60/refinedStep>360000)throw Error('Refined run exceeds the 360,000-step diagnostic budget.');
 const refined=core.yf(subject,doseEvents,constants,nominal.distribution,refinedStep);
 const delta=(a,b)=>({nominal:a??null,refined:b??null,delta:Number.isFinite(a)&&Number.isFinite(b)?b-a:null});
 const metrics={};
 for(const key of ['peakBACGdL','timeOfPeakBACH','bacAucGdLH','peakCaffeineMgL','timeOfPeakCaffeineH','caffeineAucMgHL'])metrics[key]=delta(nominal.summary[key],refined.summary[key]);
 for(const key of ['vehicleThresholdOutcome','legalThresholdOutcome','negligibleThresholdOutcome','caffeineDisplayThresholdOutcome']){
  const a=nominal.summary[key],b=refined.summary[key];metrics[key]={...delta(a.rightCensored?null:a.finalReturnH,b.rightCensored?null:b.finalReturnH),nominalStatus:a.status,refinedStatus:b.status};
 }
 for(const key of ['ethanolMassBalanceResidualG','caffeineMassBalanceResidualMg']){
  const max=points=>points.reduce((m,p)=>Math.max(m,Math.abs(p[key])),0);metrics[key]=delta(max(nominal.analysisPoints),max(refined.densePoints));
 }
 const samples=times.map(tH=>{const a=v15Interpolate(nominal.analysisPoints,tH),b=v15Interpolate(refined.densePoints,tH);return {tH,bacGdL:delta(a.bacGdL,b.bacGdL),caffeineMgL:delta(a.caffeineMgL,b.caffeineMgL)};});
 return {kind:'convergence',stepMin:step,refinedStepMin:refinedStep,method:'Event-aligned RK4 at half the accepted internal step. Zero-order elimination uses the retained split step. Differences are refined minus nominal.',preClampNegatives:refined.preClampNegativeCount,metrics,samples};
}
