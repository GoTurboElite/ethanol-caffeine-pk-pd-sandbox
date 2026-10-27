import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root,core as loadCore} from './helpers.mjs';
import {InterfacePreferences,UI_KEY,UI_VERSION} from '../src/session/preferences.mjs';
import {bacValue,bacText,bacUnit,bacMetric} from '../src/ui/units.mjs';
const results=[];
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+' '+e.stack);}}
function harness(saved=null,legacy={}){
 const data=new Map(saved?[[UI_KEY,saved]]:[]),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const store={state:{presentation:{detailMode:'default',theme:'clarity-system',density:'comfortable',bacDisplayUnit:'g/dL',...legacy},document:{title:'Preserve me',mainScenario:{doseEvents:[{id:'one',caffeineMg:95}],subject:{bodyMassKg:90},constants:{value:1}}}},fields:[],field(k,v){assert.equal(k,'settings');this.fields.push(k);this.state.presentation=v;}};
 const prefs=new InterfacePreferences(store,{localStorage:storage});return{prefs,store,storage,data};
}
await check('Expert depth, concise support and comfortable spacing are independent',()=>{
 const {prefs,store}=harness();store.state.presentation.detailMode='expert';const before=JSON.stringify(store.state.document);
 prefs.set({explanations:'concise',density:'comfortable',focus:true,motion:'reduced'});
 assert.equal(store.state.presentation.detailMode,'expert');assert.equal(prefs.values.density,'comfortable');assert.equal(JSON.stringify(store.state.document),before);
});
await check('Legacy appearance choices migrate without changing analytical inputs',()=>{
 const {prefs,store}=harness(null,{theme:'midnight',density:'audit',enhancedContrast:true,reducedMotion:true,colourfulCharts:false});
 assert.equal(prefs.values.theme,'midnight');assert.equal(prefs.values.density,'compact');assert.equal(prefs.values.motion,'reduced');assert.equal(prefs.values.palette,'restrained');assert.equal(store.state.document.title,'Preserve me');
});
await check('Interface profiles round-trip and reject invalid depth atomically',()=>{
 const {prefs,store}=harness();prefs.set({textSize:20,lineSpacing:'relaxed',focus:true});store.state.presentation.detailMode='expert';const exported=JSON.stringify(prefs.export());
 const other=harness();other.prefs.import(exported);assert.equal(other.prefs.values.textSize,20);assert.equal(other.store.state.presentation.detailMode,'expert');
 const invalid=JSON.parse(exported);invalid.scientificDepth='unsupported';const before=JSON.stringify(other.prefs.values);assert.throws(()=>other.prefs.import(JSON.stringify(invalid)));assert.equal(JSON.stringify(other.prefs.values),before);
});
await check('Corrupt profiles retain migrated defaults and surface restoration failure',()=>{
 const {prefs}=harness('broken JSON',{theme:'clarity-dark'});assert.equal(prefs.values.theme,'clarity-dark');assert.equal(prefs.status,'failed');assert.ok(prefs.error.includes('restored'));
});
await check('Preference storage failures leave the live document available',()=>{
 const {prefs,store,storage}=harness();storage.setItem=()=>{throw Error('Quota');};prefs.set({textSize:18});assert.equal(prefs.status,'failed');assert.equal(prefs.values.textSize,18);assert.equal(store.state.document.title,'Preserve me');
});
await check('Reset and panel preferences preserve the scientific document',()=>{
 const {prefs,store}=harness();const before=JSON.stringify(store.state.document);prefs.panel('standard-thresholds',true);prefs.set({theme:'clarity-dark',density:'compact'});prefs.reset('reading');assert.equal(prefs.values.theme,'clarity-dark');prefs.reset();assert.equal(prefs.values.theme,'clarity-system');assert.deepEqual(prefs.values.panels,{});assert.equal(JSON.stringify(store.state.document),before);
});
await check('BAC formatting converts values and labels together without false zero rounding',()=>{
 for(const unit of ['g/dL','% BAC','g/L','permille']){const p={bacDisplayUnit:unit};assert.equal(bacValue(.08,p),unit==='g/L'||unit==='permille'?.8:.08);assert.ok(bacText(.000001,p).startsWith('<'));assert.equal(bacUnit(p),unit==='permille'?'‰':unit);const metric=bacMetric({unit:'g/dL',a:.08,b:.04,delta:-.04},p);assert.equal(metric.a,bacValue(.08,p));assert.equal(metric.unit,bacUnit(p));const auc=bacMetric({unit:'g·h/dL',a:1,b:2,delta:1},p);assert.equal(auc.delta,bacValue(1,p));}
});
await check('v1.5 and v1.60 retain identical numerical trajectories and threshold outcomes',()=>{
 const oldHTML=fs.readFileSync(path.join(root,'public/standalone-v1.5.0.html'),'utf8'),old=new Function(oldHTML.match(/<script id="pk-kernel-source" type="text\/plain">([\s\S]*?)<\/script>/)[1]+';return PKCore;')(),current=loadCore();
 const scenarios=[[],[{id:'coffee',label:'Coffee',startTimeH:0,durationMin:15,ethanolGrams:0,caffeineMg:95,servings:1}],[{id:'one',label:'One',startTimeH:0,durationMin:60,ethanolGrams:60,caffeineMg:0,servings:1},{id:'two',label:'Two',startTimeH:12,durationMin:60,ethanolGrams:40,caffeineMg:95,servings:1}]];
 for(const events of scenarios){const a=old.Mr(structuredClone(old.St),structuredClone(events),old.bt(90)),b=current.Mr(structuredClone(current.St),structuredClone(events),current.bt(90));assert.deepEqual(b.analysisPoints,a.analysisPoints);for(const key of ['peakBACGdL','timeOfPeakBACH','peakCaffeineMgL','timeOfPeakCaffeineH','vehicleThresholdOutcome','legalThresholdOutcome','negligibleThresholdOutcome'])assert.deepEqual(b.summary[key],a.summary[key]);}
});
fs.mkdirSync(path.join(root,'test/artifacts'),{recursive:true});const output={passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};fs.writeFileSync(path.join(root,'test/artifacts/interface-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({passed:output.passed,failed:output.failed}));if(output.failed)process.exitCode=1;
