import {v15Clone,v15Interpolate,v15Stable} from '../session/core.mjs';
import {MODEL_PROFILE,PARAMETERS,validateScience,parameterValue,setParameter,activeParameter,observationValue,observationSD,cholesky} from './schema.mjs';
export const quantile=(values,p)=>{if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),i=(a.length-1)*p,j=Math.floor(i);return a[j]+(a[Math.min(a.length-1,j+1)]-a[j])*(i-j);};
export function seededRandom(seed){let t=seed>>>0;return()=>{t+=0x6D2B79F5;let x=t;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return((x^(x>>>14))>>>0)/4294967296;};}
const normal=r=>Math.sqrt(-2*Math.log(Math.max(1e-15,r())))*Math.cos(2*Math.PI*r());
function normalCDF(x){const sign=x<0?-1:1,z=Math.abs(x)/Math.SQRT2,t=1/(1+.3275911*z),erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z);return .5*(1+sign*erf);}
export function drawParameters(input,spec,random){
 const L=cholesky(spec.correlation,spec.parameters.length);
 for(let attempt=0;attempt<256;attempt++){
  const z=spec.parameters.map(()=>normal(random)),values={};let valid=true;
  for(let i=0;i<spec.parameters.length;i++){const p=spec.parameters[i],center=parameterValue(input,p.id),latent=L[i].reduce((s,a,j)=>s+a*z[j],0),u=normalCDF(latent);let v;
   if(p.distribution==='uniform')v=p.lower+(p.upper-p.lower)*u;
   else if(p.distribution==='lognormal')v=center*Math.exp(Math.sqrt(Math.log(1+p.cv*p.cv))*latent);
   else{if(center<p.lower||center>p.upper)throw Error('The triangular mode must be inside its bounds: '+PARAMETERS[p.id].label);const cut=(center-p.lower)/(p.upper-p.lower);v=u<cut?p.lower+Math.sqrt(u*(p.upper-p.lower)*(center-p.lower)):p.upper-Math.sqrt((1-u)*(p.upper-p.lower)*(p.upper-center));}
   if(v<p.lower||v>p.upper){valid=false;break;}values[p.id]=v;
  }if(valid)return values;
 }throw Error('Truncated sampling rejected 256 consecutive draws. Widen bounds or reduce CV/correlation.');
}
export function simulate(core,input){const result=core.Mr(v15Clone(input.subject),v15Clone(input.doseEvents),v15Clone(input.constants));if(result.numericalValidity!=='valid'||!result.integrity?.massBalancePassed||!result.convergence?.converged)throw Error('The scientific job encountered a numerically invalid trajectory.');return result;}
function inputBudget(input,evaluations){const h=input.subject.simulationDurationH,step=input.subject.solverInternalStepMin??.5;if(!Number.isFinite(h)||!Number.isFinite(step)||h<=0||step<=0||h*60/step*evaluations>2500000)throw Error('This job exceeds the numerical work budget. Reduce samples, fit evaluations, horizon or internal resolution.');}
function assertActive(core,input,id){activeParameter({...input,doseEvents:input.doseEvents.map(e=>({...e,ethanolGrams:core.Ta(e,input.constants),caffeineMg:core.Na(e)}))},id);}
export function observationResiduals(result,rows){
 return rows.map(row=>{const p=v15Interpolate(result.analysisPoints??result.points,row.timeH);if(!p)throw Error('Observation '+row.id+' lies outside the calculated horizon. Extend the horizon or remove that observation.');const predicted=row.analyte==='ethanol'?p.bacGdL:p.caffeineMgL,observed=observationValue(row),sd=observationSD(row),residual=predicted-observed,penalty=row.qualifier==='<'?Math.max(0,residual):residual;
 return{...row,canonicalUnit:row.analyte==='ethanol'?'g/dL':'mg/L',observed,predicted,residual,weighted:penalty/sd,assumedSD:row.sd==null};});
}
export function residualMetrics(rows){const out=[];for(const analyte of ['ethanol','caffeine'])for(const role of ['calibration','evaluation']){const all=rows.filter(o=>o.analyte===analyte&&o.role===role),a=all.filter(o=>o.qualifier==='=');if(all.length)out.push({analyte,role,n:a.length,censored:all.length-a.length,unit:analyte==='ethanol'?'g/dL':'mg/L',bias:a.length?a.reduce((s,o)=>s+o.residual,0)/a.length:null,mae:a.length?a.reduce((s,o)=>s+Math.abs(o.residual),0)/a.length:null,rmse:a.length?Math.sqrt(a.reduce((s,o)=>s+o.residual**2,0)/a.length):null,weightedSSE:all.reduce((s,o)=>s+o.weighted**2,0)});}return out;}
const compactPoints=r=>(r.analysisPoints??r.points).filter((_,i,a)=>i%Math.max(1,Math.ceil(a.length/180))===0||i===a.length-1).map(p=>({tH:p.tH,bacGdL:p.bacGdL,caffeineMgL:p.caffeineMgL}));
export async function evaluate(core,input,doc,context){const result=simulate(core,input),residuals=observationResiduals(result,doc.observations);context.progress(1,1);return{kind:'evaluate',profile:MODEL_PROFILE,residuals,metrics:residualMetrics(residuals),points:compactPoints(result),summary:result.summary};}
export async function calibrate(core,input,doc,context){
 const spec=doc.fit,parameters=spec.parameters,rows=doc.observations.filter(o=>o.role==='calibration'&&parameters.some(p=>PARAMETERS[p.id].analyte===o.analyte)),quantified=rows.filter(o=>o.qualifier==='=');
 if(quantified.length<Math.max(4,parameters.length*3)||new Set(quantified.map(o=>o.timeH)).size<3)throw Error('Calibration requires at least '+Math.max(4,parameters.length*3)+' quantified calibration observations at three distinct times.');
 for(const p of parameters){assertActive(core,input,p.id);if(!rows.some(o=>o.analyte===PARAMETERS[p.id].analyte))throw Error('No calibration observations match '+PARAMETERS[p.id].label+'.');}
 inputBudget(input,spec.maxEvaluations+20);let count=0,best=null;
 const lower=parameters.map(p=>Math.log(p.lower)),upper=parameters.map(p=>Math.log(p.upper));
 async function score(x){context.check();if(count>=spec.maxEvaluations)return Infinity;const candidate=v15Clone(input);parameters.forEach((p,i)=>setParameter(candidate,p.id,Math.exp(x[i])));const result=simulate(core,candidate),residuals=observationResiduals(result,rows),cost=residuals.reduce((s,o)=>s+o.weighted**2,0);count++;if(!best||cost<best.cost)best={x:[...x],cost,input:candidate};if(count%4===0){context.progress(count,spec.maxEvaluations);await context.yield();}return cost;}
 const initial=parameters.map((p,i)=>Math.log(Math.max(p.lower,Math.min(p.upper,parameterValue(input,p.id)))));await score(initial);
 const starts=[initial,lower.map((a,i)=>a+(upper[i]-a)*.25),lower.map((a,i)=>a+(upper[i]-a)*.75)];
 let converged=false;
 for(const start of starts){let x=[...start],previous=Infinity;for(let cycle=0;cycle<8&&count<spec.maxEvaluations;cycle++){
   for(let j=0;j<parameters.length&&count<spec.maxEvaluations;j++){let a=lower[j],b=upper[j],c=b-(b-a)*.61803398875,d=a+(b-a)*.61803398875,xc=[...x],xd=[...x];xc[j]=c;xd[j]=d;let fc=await score(xc),fd=await score(xd);
    for(let k=0;k<12&&count<spec.maxEvaluations;k++){if(fc<fd){b=d;d=c;fd=fc;c=b-(b-a)*.61803398875;xc=[...x];xc[j]=c;fc=await score(xc);}else{a=c;c=d;fc=fd;d=a+(b-a)*.61803398875;xd=[...x];xd[j]=d;fd=await score(xd);}}x[j]=fc<fd?c:d;
   }
   const value=await score(x);if(Number.isFinite(value)&&Math.abs(previous-value)<1e-6*(1+value)){converged=true;break;}previous=value;
  }}
 if(!best)throw Error('No finite calibration result.');const result=simulate(core,best.input),residuals=observationResiduals(result,doc.observations),values=Object.fromEntries(parameters.map((p,i)=>[p.id,Math.exp(best.x[i])])),columns=[],objectiveColumns=[];
 for(const p of parameters){const value=values[p.id],delta=Math.max(value*.002,1e-6),a=v15Clone(best.input),b=v15Clone(best.input),lo=Math.max(p.lower,value-delta),hi=Math.min(p.upper,value+delta);setParameter(a,p.id,lo);setParameter(b,p.id,hi);const ar=simulate(core,a),br=simulate(core,b),ra=observationResiduals(ar,quantified),rb=observationResiduals(br,quantified);columns.push(ra.map((r,i)=>(rb[i].predicted-r.predicted)/(hi-lo)/observationSD(quantified[i])*value));const aa=observationResiduals(ar,rows),bb=observationResiduals(br,rows);objectiveColumns.push(aa.map((r,i)=>(bb[i].weighted-r.weighted)/(hi-lo)*value));}
 const norms=columns.map(a=>Math.sqrt(a.reduce((s,x)=>s+x*x,0))),dot=columns.length===2?columns[0].reduce((s,x,i)=>s+x*columns[1][i],0)/(norms[0]*norms[1]):0,identifiable=norms.every(n=>Number.isFinite(n)&&n>1e-5)&&Math.abs(dot)<.995;
 const weightedResiduals=observationResiduals(result,rows).map(o=>o.weighted),stationarity=Math.max(...objectiveColumns.map(a=>Math.abs(a.reduce((s,x,i)=>s+x*weightedResiduals[i],0))/Math.max(1e-12,Math.sqrt(a.reduce((s,x)=>s+x*x,0)))));converged=converged||(Number.isFinite(stationarity)&&stationarity<.05);
 const atBounds=parameters.filter(p=>(values[p.id]-p.lower)/(p.upper-p.lower)<.01||(p.upper-values[p.id])/(p.upper-p.lower)<.01).map(p=>p.id);
 const profile=[];
 if(parameters.length===1){const p=parameters[0];for(let i=0;i<=20;i++){context.check();const candidate=v15Clone(best.input),value=Math.exp(lower[0]+(upper[0]-lower[0])*i/20);setParameter(candidate,p.id,value);const cost=observationResiduals(simulate(core,candidate),rows).reduce((s,o)=>s+o.weighted**2,0);profile.push({value,cost});if(i%4===0)await context.yield();}}
 const support=profile.filter(p=>p.cost-best.cost<=3.841459),interval=profile.length&&rows.every(r=>r.qualifier==='='&&r.sd!==null)&&support.length?{lower:support[0].value,upper:support.at(-1).value,method:'Coarse profile support: delta weighted SSE <= 3.841459, conditional on independent Gaussian errors with the supplied SDs. Grid endpoints can truncate support.'}:null;
 return{kind:'fit',profile:MODEL_PROFILE,values,cost:best.cost,evaluations:count,converged,identifiable,stationarity,sensitivityCorrelation:Number.isFinite(dot)?dot:null,atBounds,applicable:identifiable&&atBounds.length===0&&converged,residuals,metrics:residualMetrics(residuals),profilePoints:profile,supportInterval:interval,points:compactPoints(result),summary:result.summary,assumptions:'Bounded log-parameter weighted least squares; independent supplied SD or explicit defaults (ethanol 0.002 g/dL; caffeine 0.1 mg/L). Upper limits use a one-sided squared penalty. Matrix factors are user supplied. Evaluation rows are excluded from fitting. Numerical stopping uses objective stabilization or residual projection below 0.05 weighted units along every local parameter sensitivity.'};
}
function metric(r){return{peakBAC:r.summary.peakBACGdL,peakCaffeine:r.summary.peakCaffeineMgL,bacPeakTime:r.summary.timeOfPeakBACH,caffeinePeakTime:r.summary.timeOfPeakCaffeineH};}
const summarize=values=>({p05:quantile(values,.05),p50:quantile(values,.5),p95:quantile(values,.95)});
export async function sample(core,input,doc,context,comparison=null){
 const spec=doc.uncertainty,n=spec.samples,paired=spec.paired;if(paired&&!comparison)throw Error('Enable and prepare an A/B comparison before requesting paired uncertainty.');
 const a=paired?comparison.A:input,b=paired?comparison.B:null;for(const p of spec.parameters){assertActive(core,a,p.id);if(b)assertActive(core,b,p.id);}inputBudget(a,n*(paired?2:1));if(b)inputBudget(b,n*2);
 const random=seededRandom(spec.seed),grid=Array.from({length:97},(_,i)=>a.subject.simulationDurationH*i/96),series=grid.map(tH=>({tH,bac:[],caffeine:[],exceed:0})),draws=[],summaries=[],deltas=[],returns=[];let censored=0,never=0;
 if(b&&b.subject.simulationDurationH!==a.subject.simulationDurationH)throw Error('Paired uncertainty requires equal A/B horizons.');
 if(b&&spec.parameters.some(p=>parameterValue(a,p.id)!==parameterValue(b,p.id)))throw Error('Paired absolute-parameter sampling requires equal reference values for selected A/B parameters. Compare dose or timing changes, or use separate runs for different parameter baselines.');
 for(let i=0;i<n;i++){context.check();const values=drawParameters(a,spec,random),candidate=v15Clone(a);for(const [id,value]of Object.entries(values))setParameter(candidate,id,value);const r=simulate(core,candidate);draws.push(values);summaries.push(metric(r));
  for(const bucket of series){const p=v15Interpolate(r.analysisPoints??r.points,bucket.tH);bucket.bac.push(p.bacGdL);bucket.caffeine.push(p.caffeineMgL);if(p.bacGdL>=a.subject.vehicleZeroToleranceThresholdGdL)bucket.exceed++;}
  const out=r.summary.vehicleThresholdOutcome;if(out?.rightCensored)censored++;else if(out?.status==='never-exceeded'){never++;returns.push(0);}else if(Number.isFinite(out?.timeH))returns.push(out.timeH);
  if(b){const other=v15Clone(b);for(const [id,value]of Object.entries(values))setParameter(other,id,value);const m=metric(simulate(core,other)),base=summaries.at(-1);deltas.push(Object.fromEntries(Object.keys(m).map(k=>[k,m[k]-base[k]])));}
  context.progress(i+1,n);await context.yield();
 }
 return{kind:'uncertainty',profile:MODEL_PROFILE,seed:spec.seed,samples:n,paired,parameterDraws:draws,grid:series.map(p=>({tH:p.tH,bac:summarize(p.bac),caffeine:summarize(p.caffeine),thresholdExceedanceFraction:p.exceed/n})),metrics:Object.fromEntries(Object.keys(summaries[0]).map(k=>[k,summarize(summaries.map(s=>s[k]))])),deltas:paired?Object.fromEntries(Object.keys(deltas[0]).map(k=>[k,summarize(deltas.map(s=>s[k]))])):null,threshold:{value:a.subject.vehicleZeroToleranceThresholdGdL,unit:'g/dL',rightCensored:censored,neverExceeded:never,resolved:returns.length,returnTimeResolvedOnly:summarize(returns)},assumptions:'P05/P50/P95 are sampled quantiles conditional on user-specified parameter distributions. Correlation is latent Gaussian-copula correlation before truncation. Whole-draw rejection enforces bounds. Lognormal reference values are medians. Population heterogeneity, model discrepancy and observation error are absent unless explicitly represented. Paired A/B uses identical absolute parameter draws.'};
}
export async function runScience(core,request,options={}){
 const doc=validateScience(request.document),input=v15Clone(request.input),context={check:()=>{if(options.cancelled?.())throw Error('Scientific job cancelled.');},yield:options.yield??(()=>new Promise(r=>setTimeout(r,0))),progress:options.progress??(()=>{})};
 inputBudget(input,1);if(['fit','evaluate'].includes(request.kind)&&doc.observations.some(o=>o.timeH>input.subject.simulationDurationH))throw Error('An observation lies outside the calculated horizon. Extend the horizon before analysis.');let result;
 if(request.kind==='fit')result=await calibrate(core,input,doc,context);
 else if(request.kind==='uncertainty')result=await sample(core,input,doc,context,request.comparison);
 else if(request.kind==='evaluate')result=await evaluate(core,input,doc,context);
 else throw Error('Unsupported scientific job.');
 context.check();return{...result,scenario:input,document:doc,comparison:request.comparison??null,inputKey:v15Stable({input,document:doc,comparison:request.comparison??null}),scientificVersion:'1.0.0',computedAt:new Date().toISOString()};
}
