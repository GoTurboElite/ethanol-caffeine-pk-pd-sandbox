import {v15Clone} from '../session/core.mjs';
import {PARAMETERS,setParameter,parameterValue,activeParameter} from './schema.mjs';
import {simulate} from './analysis.mjs';
import {exposure,difference} from './metrics.mjs';
export function sweepSpec(input,axes){
 if(!Array.isArray(axes)||axes.length<1||axes.length>2||new Set(axes.map(a=>a.id)).size!==axes.length)throw Error('Choose one or two distinct sweep parameters.');
 let count=1;const safe=axes.map(a=>{const p=PARAMETERS[a.id],lower=Number(a.lower),upper=Number(a.upper),steps=Number(a.steps);if(!p||!Number.isFinite(lower)||!Number.isFinite(upper)||lower<p.min||upper>p.max||lower>=upper||!Number.isInteger(steps)||steps<2||steps>21)throw Error('Sweep bounds must increase within the registered domain; use 2 to 21 values per axis.');activeParameter(input,a.id);count*=steps;return{id:a.id,lower,upper,steps,unit:p.unit,baseline:parameterValue(input,a.id)};});
 if(count>49)throw Error('Sweeps support at most 49 evaluations.');
 const steps=input.subject.simulationDurationH*60/(input.subject.solverInternalStepMin??.5);if(steps*count>2500000)throw Error('Sweep exceeds the numerical work budget.');return safe;
}
export async function sweep(core,input,axes,options={}){
 const safe=sweepSpec(input,axes),members=[],sets=safe.map(a=>Array.from({length:a.steps},(_,i)=>a.lower+(a.upper-a.lower)*i/(a.steps-1)));
 for(const x of sets[0])for(const y of sets[1]??[null]){if(options.cancelled?.())throw Error('Sweep cancelled.');const scenario=v15Clone(input),values={[safe[0].id]:x,...(safe[1]?{[safe[1].id]:y}:{})};for(const [id,value]of Object.entries(values))setParameter(scenario,id,value);const r=simulate(core,scenario),e=exposure(r);members.push({index:members.length,values,metrics:{peakBAC:e.bac.peak,peakCaffeine:e.caffeine.peak,bacAuc:e.bac.auc,caffeineAuc:e.caffeine.auc,bacPeakTime:e.bac.peakTime,caffeinePeakTime:e.caffeine.peakTime},threshold:r.summary.vehicleThresholdOutcome});options.progress?.(members.length,sets[0].length*(sets[1]?.length??1));await(options.yield?.()??new Promise(r=>setTimeout(r,0)));}
 return {axes:safe,members,source:input,method:'Finite-range scenario evaluations. Grid slopes are secant effects, not derivatives or confidence intervals. Two-axis contrasts measure finite differences in differences.'};
}
export function sweepEffects(result,metric){const axes=result.axes,m=result.members,first=m[0],last=m.at(-1),effect=difference(first.metrics[metric],last.metrics[metric]);if(axes.length===1)return{...effect,secant:effect.absolute/(axes[0].upper-axes[0].lower),parameterUnit:axes[0].unit,interpretation:'Endpoint secant over the complete stated range; nonlinear responses need inspection of intermediate members.'};const ny=axes[1].steps,at=(x,y)=>m[x*ny+y].metrics[metric];return{interaction:at(axes[0].steps-1,ny-1)-at(axes[0].steps-1,0)-at(0,ny-1)+at(0,0),interpretation:'Finite corner difference in differences; depends on the stated ranges and selected metric.'};}
