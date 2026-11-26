import assert from 'node:assert/strict';
import {core as loadCore} from './helpers.mjs';
import {mechanismContext,mechanismAt} from '../src/science/mechanism.mjs';
import {scheduleRows,scheduleTotals,planSeries,alignedSchedule} from '../src/science/schedule.mjs';
import {compareExposure} from '../src/science/metrics.mjs';
import {sweep} from '../src/science/exploration.mjs';
import {inspectConvergence} from '../src/science/convergence.mjs';
import {runScience,simulate,prospectiveValue} from '../src/science/analysis.mjs';
import {emptyScience,validateScience,setParameter} from '../src/science/schema.mjs';
import {nuisanceProfiles} from '../src/science/profile.mjs';
const core=loadCore(),near=(a,b,atol=1e-8)=>assert.ok(Math.abs(a-b)<=atol,a+' versus '+b);
const event=(id,startTimeH,durationMin,ethanolGrams,caffeineMg)=>({id,label:id,startTimeH,durationMin,ethanolGrams,caffeineMg,servings:1});
const make=()=>({subject:{...structuredClone(core.St),simulationDurationH:4},constants:core.bt(90),doseEvents:[]});
const scenario=make();
scenario.subject.initialConditions.caffeineCentralMg=20;
scenario.subject.initialConditions.centralEthanolG=2;
scenario.constants.paraxanthineApproximationEnabled=true;
scenario.doseEvents=[event('a',0,60,10,100),event('b',.5,60,5,50),event('bolus',.75,0,12,20),event('second',.75,0,1,5)];
for(const mode of ['Michaelis-Menten','zero-order']){
 const s=structuredClone(scenario);s.subject.ethanolEliminationMode=mode;
 const r=simulate(core,s),ctx=mechanismContext(core,s,r);
 for(const time of [0,.1,.49999,.74999,.75,.75001,1.25,4]){
  const q=mechanismAt(ctx,time),f=q.values;
  near(q.ethanol.residual,0);near(q.caffeine.residual,0);
  near(f.ethanolAppearance+f.firstPass,f.gastricUptake+f.intestinalUptake);
  near(f.caffeineElimination,q.caffeineKPerH*f.caffeineCentralMg);
  near(q.caffeineClearanceLPerH,q.caffeineKPerH*q.caffeineVdL);
  if(time===.75){assert.equal(q.boluses.length,2);near(f.ethanolInput,15);}
 }
 const left=mechanismAt(ctx,.75-1e-10),right=mechanismAt(ctx,.75);
 near(right.values.gastricEthanolG-left.values.gastricEthanolG,13,1e-7);
 near(right.values.caffeineGutMg-left.values.caffeineGutMg,25,1e-7);
}
const zero=make(),zr=simulate(core,zero),zc=mechanismAt(mechanismContext(core,zero,zr),1);
assert.equal(zc.ethanol.relativeResidual,null);assert.equal(zc.caffeine.relativeResidual,null);
const decay=make();decay.subject.initialConditions.caffeineCentralMg=100;decay.subject.simulationDurationH=72;
const dr=simulate(core,decay),dc=mechanismContext(core,decay,dr);
near(mechanismAt(dc,5).values.caffeineCentralMg,50);
near(mechanismAt(dc,72).values.caffeineCentralMg,100*2**(-72/5));
const convergence=inspectConvergence(core,decay,dr,[0,5,72]);
assert.equal(convergence.refinedStepMin,convergence.stepMin/2);near(convergence.samples[1].caffeineMgL.delta,0,1e-8);
const rows=scheduleRows(core,scenario),window=scheduleTotals(rows,.5,1);
near(window.ethanolG,20.5);near(window.caffeineMg,100);near(window.activeMinutes,30);assert.equal(window.count,4);
let copyId=0;const plan=planSeries(scenario,['dose:a'],'repeat',3,.5,k=>k+(++copyId));
assert.equal(plan.review.length,3);assert.equal(scenario.doseEvents.length,4);assert.equal(plan.next.doseEvents.length,7);
assert.equal(alignedSchedule(rows,scheduleRows(core,plan.next)).filter(r=>r.changes.includes('Added')).length,3);
const removed=planSeries(scenario,['dose:a','dose:bolus'],'remove',0,0);assert.equal(removed.next.doseEvents.length,2);
const source=structuredClone(scenario);source.doseEvents[0].caffeineMg=50;
const axes=[{id:'caffeineHalfLifeH',lower:3,upper:7,steps:3}],res=await sweep(core,source,axes,{reference:scenario,window:{start:.2,end:3},yield:()=>{}});
for(const m of res.members){
 const a=structuredClone(scenario),b=structuredClone(source);setParameter(a,axes[0].id,m.values.caffeineHalfLifeH);setParameter(b,axes[0].id,m.values.caffeineHalfLifeH);
 const c=compareExposure(simulate(core,a),simulate(core,b),.2,3);
 near(m.comparison.caffeine.signedAuc,c.temporal.caffeine.signedAuc);near(c.temporal.caffeine.meanAbsoluteDifference,c.temporal.caffeine.absoluteAuc/2.8);
 near(c.temporal.caffeine.referenceNormalisedDivergence,c.temporal.caffeine.absoluteAuc/c.reference.caffeine.auc);
}
const pars=[{id:'a',lower:1,upper:4},{id:'b',lower:1,upper:4}],grid=Array.from({length:7},(_,i)=>4**(i/6));
const objective=({a,b})=>(a-2)**2+(b-(1+a/2))**2;
const surface=grid.flatMap(x=>grid.map(y=>({x,y,cost:objective({a:x,b:y})})));
const profiles=await nuisanceProfiles(pars,surface,0,objective,{check(){},yield(){}});
for(const p of profiles){const f=p.fixedValue,n=p.fixedParameter==='a'?1+f/2:Math.min(4,Math.max(1,(f+3)/2.5));near(p.optimum,n,.004);assert.ok(p.converged);assert.ok(p.evaluations<=18);}
const doc=emptyScience();doc.uncertainty.samples=16;doc.uncertainty.paired=true;
const job={kind:'uncertainty',input:scenario,document:doc,comparison:{A:scenario,B:scenario}},options={yield:()=>{}};
const latent=await runScience(core,job,options);doc.uncertainty.observationError={model:'additive',ethanol:0,caffeine:0};
const exact=await runScience(core,job,options);assert.deepEqual(latent.grid,exact.grid);assert.deepEqual(exact.parameterDraws,latent.parameterDraws);
exact.predictiveGrid.forEach((r,i)=>{assert.deepEqual(r.A.caffeine,latent.grid[i].caffeine);near(r.difference.caffeine.p95,0);});
doc.uncertainty.observationError={model:'lognormal',ethanol:.1,caffeine:.2};
const predicted=await runScience(core,job,options),again=await runScience(core,job,options);
assert.deepEqual(predicted.predictiveGrid,again.predictiveGrid);assert.deepEqual(predicted.grid,latent.grid);
assert.ok(predicted.predictiveGrid.some(r=>r.difference.caffeine.p95>0));assert.ok(predicted.predictiveGrid.every(r=>r.A.caffeine.p05>=0));
near(prospectiveValue(0,.2,'lognormal',-2),0);near(prospectiveValue(0,.2,'additive',-2),-.4);
const old=structuredClone(doc);old.schemaVersion='1.2.0';assert.equal(validateScience(old).uncertainty.observationError,undefined);
console.log('PASS compartment equations, discrete boluses, both elimination modes, equivalent-mass balances, analytic decay, refinement, schedule overlap, paired sweeps, nuisance optima, seeded predictive errors and migration.');
