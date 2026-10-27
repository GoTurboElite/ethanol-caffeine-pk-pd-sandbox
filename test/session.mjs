import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {core as loadCore,root} from './helpers.mjs';
import {v15LocalInstants,v15ResolveLocal,v15Reanchor,v15ShiftFrame,V15History,v15Interpolate,v15SafeParse,v15Fluxes,v15Clone,v15Stable} from '../src/session/core.mjs';
import {V15Controller} from '../src/session/controller.mjs';
import {V15Storage} from '../src/session/storage.mjs';
import {v15BuildReport} from '../src/ui/report.mjs';
import {V15_GUIDES} from '../src/content/guide.mjs';
const c=loadCore(),results=[];
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,error:error.stack});console.error('FAIL '+name+' '+error.stack);}}
function initial(){
 const scenario={subject:v15Clone(c.St),doseEvents:[{id:'one',label:'Coffee',startTimeH:0,durationMin:15,ethanolGrams:0,caffeineMg:95,servings:1}],constants:c.bt(90)};
 return {document:{title:'Test session',notes:'',mainScenario:scenario,comparisonScenarios:{A:{...v15Clone(scenario),id:'A',label:'A'},B:{...v15Clone(scenario),id:'B',label:'B'}},comparisonEnabled:false,behaviourProfile:c.hn(),comparisonBehaviourProfiles:{A:c.hn(),B:c.hn()},useSeparateBehaviourProfiles:false,sweepConfiguration:{},autosaveEnabled:false},
 presentation:{scenarioAnchorInstant:'2026-10-25T00:30:00.000Z',scenarioTimeZone:'Europe/London',selectedTimeH:1,selectedTimeProvenance:'manual',selectedLandmarkId:null,followNow:false,timeDisplayMode:'clock',timeReferenceBasis:'model-time-zero'},markers:[]};
}
const mapping={title:['document','title'],notes:['document','notes'],subject:['document','mainScenario','subject'],doses:['document','mainScenario','doseEvents'],constants:['document','mainScenario','constants'],comparisons:['document','comparisonScenarios'],comparisonEnabled:['document','comparisonEnabled'],profile:['document','behaviourProfile'],comparisonProfiles:['document','comparisonBehaviourProfiles'],separateProfiles:['document','useSeparateBehaviourProfiles'],sweepConfig:['document','sweepConfiguration'],autosave:['document','autosaveEnabled'],preset:['document','activePresetMetadata'],supersededPreset:['document','supersededPresetId'],comparisonTemplate:['document','comparisonTemplateId']};
function localStorage(){const data=new Map();return{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};}
function controller(){
 const first=initial(),listeners=new Set();
 const store={state:{document:first.document,presentation:first.presentation,draft:{validation:{status:'valid'}},editingInvalidCount:0},depth:0,subscribe:f=>{listeners.add(f);return()=>listeners.delete(f);},transaction(label,fn){this.depth++;try{return fn();}finally{this.depth--;}},
 field(name,update){let value;if(name==='settings'){value=typeof update==='function'?update(this.state.presentation):update;this.state.presentation={...this.state.presentation,...value};}
 else{const p=mapping[name];let obj=this.state;for(const key of p.slice(0,-1))obj=obj[key];const key=p.at(-1);obj[key]=typeof update==='function'?update(obj[key]):update;}
 for(const f of listeners)f();}};
 const env={localStorage:localStorage(),sessionStorage:localStorage()};
 const api=new V15Controller({store,versions:c.qt,validate:c.cheapValidation,resolveProfile:c.Bm,runtime:{cancelRequest(){},releaseOwner(){}},importLegacy(){throw Error('Legacy adapter exercised in the browser suite.');}},env);
 return{api,store,env};
}
await check('London autumn overlap retains two distinct instants',()=>{
 const times=v15LocalInstants('2026-10-25T01:30','Europe/London');assert.deepEqual(times,['2026-10-25T00:30:00.000Z','2026-10-25T01:30:00.000Z']);assert.throws(()=>v15ResolveLocal('2026-10-25T01:30','Europe/London'),/occurs twice/);assert.equal(v15ResolveLocal('2026-10-25T01:30','Europe/London','later'),times[1]);
});
await check('Spring clock gap and invalid calendar dates are rejected',()=>{assert.deepEqual(v15LocalInstants('2026-03-29T01:30','Europe/London'),[]);assert.throws(()=>v15ResolveLocal('2026-03-29T01:30','Europe/London'),/gap/);assert.throws(()=>v15LocalInstants('2026-02-30T12:00','UTC'),/does not exist/);});
await check('Fractional-offset zone resolves exactly',()=>{assert.deepEqual(v15LocalInstants('2026-01-01T12:00','Asia/Kathmandu'),['2026-01-01T06:15:00.000Z']);});
await check('Reanchoring preserves either event instants or elapsed values',()=>{
 const f=initial(),old=Date.parse(f.presentation.scenarioAnchorInstant),next='2026-10-26T00:30:00Z';
 const elapsed=v15Reanchor(f,next,'UTC','elapsed');assert.equal(elapsed.document.mainScenario.doseEvents[0].startTimeH,0);
 const absolute=v15Reanchor(f,next,'UTC','absolute');assert.equal(Date.parse(absolute.presentation.scenarioAnchorInstant)+absolute.document.mainScenario.doseEvents[0].startTimeH*3600000,old);assert.equal(f.document.mainScenario.doseEvents[0].startTimeH,0);
});
await check('Group copy preserves amounts, distinct IDs and original schedule',()=>{const f=initial(),next=v15ShiftFrame(f,['dose:one'],24,true,()=> 'new-id');assert.equal(next.document.mainScenario.doseEvents.length,2);assert.equal(next.document.mainScenario.doseEvents[1].caffeineMg,95);assert.equal(next.document.mainScenario.doseEvents[1].startTimeH,24);assert.equal(f.document.mainScenario.doseEvents.length,1);});
await check('History has bounded branching and redo semantics',()=>{const h=new V15History(initial(),4);for(let n=0;n<7;n++){const f=initial();f.document.title='Edit '+n;h.push(f,'Edit '+n,n*1000+100000);}assert.equal(h.entries.length,4);const prior=h.undo();assert.ok(prior);assert.ok(h.canRedo);const branch=initial();branch.document.title='Branch';h.push(branch,'Branch',200000);assert.equal(h.canRedo,false);});
await check('Canonical transactions become one history operation',async()=>{const {api,store}=controller();await api.ready;store.transaction('SCENARIO_TRANSACTION',()=>{store.field('title','New');store.field('notes','Changed');});assert.equal(api.history.entries.length,2);api.undo();assert.equal(store.state.document.title,'Test session');assert.equal(store.state.document.notes,'');api.redo();assert.equal(store.state.document.title,'New');api.dispose();});
await check('Session export survives an inspection-cursor change and restores atomically',async()=>{const {api,store}=controller();await api.ready;store.field('title','Portable');api.inspect(3);const exported=api.project(true);const {api:other}=controller();await other.ready;other.importText(JSON.stringify(exported));assert.equal(other.store.state.document.title,'Portable');assert.equal(other.store.state.presentation.selectedTimeH,3);assert.equal(other.importedHistory.length,exported.history.entries.length);other.undo();assert.equal(other.store.state.document.title,'Test session');api.dispose();other.dispose();});
await check('Malformed imported history cannot partially replace the working document',async()=>{const {api,store}=controller();await api.ready;const p=api.project();p.frame.document.title='Should not apply';p.history.entries[0].frame.document.mainScenario.subject.bodyMassKg=0;const before=v15Stable(api.capture());assert.throws(()=>api.importObject(p));assert.equal(v15Stable(api.capture()),before);api.dispose();});
await check('Invalid working documents cannot be saved as accepted sessions',async()=>{const {api,store}=controller();await api.ready;store.state.editingInvalidCount=1;assert.throws(()=>api.project(),/Finish or correct/);api.dispose();});
await check('Storage denial is surfaced while portable export remains available',async()=>{const {api}=controller();await api.ready;api.env.localStorage.setItem=()=>{throw Error('Quota exceeded');};await assert.rejects(api.saveNamed('Probe'));assert.equal(api.project().appVersion,'1.6.0');api.dispose();});
await check('Recovery writes are ordered and report the latest document',async()=>{const {api,store}=controller();await api.ready;await api.setRecovery(true);store.field('title','First');const a=api.flushRecovery();store.field('title','Second');const b=api.flushRecovery();await Promise.all([a,b]);assert.equal((await api.storage.get('recovery')).project.frame.document.title,'Second');assert.equal(api.storageStatus,'saved');api.dispose();});
await check('Report escapes notes and keeps complete calculation identity',()=>{
 const f=initial();f.document.notes='<img src=x onerror=alert(1)>';const r=c.Mr(f.document.mainScenario.subject,f.document.mainScenario.doseEvents,f.document.mainScenario.constants);const html=v15BuildReport({frame:f,result:r,snapshotId:'test-snapshot',versions:c.qt,depth:'expert'});assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('test-snapshot'));assert.ok(html.includes('Complete constants'));assert.ok(html.includes('Full-horizon concentration curves'));assert.equal((html.match(/<svg /g)||[]).length,2);assert.ok(html.includes('stroke-dasharray="7 4"'));assert.ok(html.includes('Accepted BAC concentration curve in g/dL'));assert.ok(html.includes('Accepted Caffeine concentration curve in mg/L'));
});
await check('Local rates derive from conserved cumulative trajectories',()=>{const f=initial(),r=c.Mr(f.document.mainScenario.subject,f.document.mainScenario.doseEvents,f.document.mainScenario.constants),flux=v15Fluxes(r,2);assert.ok(flux.caffeineEliminationMgPerH>0);assert.ok(flux.caffeineSystemicAppearanceMgPerH>=0);assert.equal(v15Interpolate(r.analysisPoints,25),null);});
await check('Prototype-bearing and oversized documents are rejected',()=>{assert.throws(()=>v15SafeParse('{"__proto__":{"polluted":1}}'),/unsupported/);assert.throws(()=>v15SafeParse(' '.repeat(8*1024*1024+1)),/8 MiB/);});
await check('Every expertise level has explicit actions, results and scope',()=>{for(const mode of ['default','detailed','expert']){const guide=V15_GUIDES[mode];assert.ok(guide.scope.length>50);const steps=guide.sections.flatMap(s=>s.steps);assert.ok(steps.length>=12);for(const step of steps)assert.ok(step.length>=4&&step.every(v=>typeof v==='string'&&v.length>10));}});
await check('Captured comparisons survive unrelated edits and invalidate on a captured-input change',async()=>{
 const {api,store}=controller();await api.ready;store.field('comparisonEnabled',true);
 api.comparisonKey=v15Stable(api.comparisonInput());const result={status:'valid',key:api.comparisonKey};api.comparison=result;
 store.field('title','Unrelated working title');api.addMarker({label:'Reference',kind:'custom',timeH:2});
 assert.equal(api.comparison,result);
 const scenarios=v15Clone(store.state.document.comparisonScenarios);scenarios.B.doseEvents[0].caffeineMg=100;store.field('comparisons',scenarios);
 assert.equal(api.comparison,null);assert.equal(api.comparisonKey,null);api.dispose();
});
fs.mkdirSync(path.join(root,'test/artifacts'),{recursive:true});const output={passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};fs.writeFileSync(path.join(root,'test/artifacts/session-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({passed:output.passed,failed:output.failed}));if(output.failed)process.exitCode=1;
