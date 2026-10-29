import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {root,core as loadCore} from './helpers.mjs';
import {observationDefaults,manualObservationChange} from '../src/ui/observation-entry.mjs';
import {emptyScience,parseObservations,observationValue,observationSD} from '../src/science/schema.mjs';
import {locationFor,routeActive,calculationState,SCIENTIFIC_VIEWS} from '../src/ui/routes.mjs';
const results=[];const check=(name,fn)=>{try{fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+' '+e.stack);}};
const anchor='2026-10-29T20:00:00Z',draft=()=>({...observationDefaults(),time:'1',value:'1.5',sd:'.1',label:'Measured sample'}),create=(doc,d,id='manual-proof')=>manualObservationChange(doc,d,anchor,{id});
check('Structured entry and CSV use identical measurement schema and conversions',()=>{
 const r=create(emptyScience(),draft());assert.deepEqual(r.errors,{});const csv=parseObservations('time_h,analyte,value,unit,matrix,sd,role,qualifier,label\n1,caffeine,1.5,mg/L,plasma,.1,evaluation,=,Measured sample',anchor)[0];assert.deepEqual({...r.row,id:'same'},{...csv,id:'same'});
 const ethanol=create(emptyScience(),{...observationDefaults('ethanol'),time:'2',value:'80',unit:'mg/dL',sd:'2'});assert.equal(observationValue(ethanol.row),.08);assert.equal(observationSD(ethanol.row),.002);
});
check('Structured calendar rows retain explicit offset and model-zero semantics',()=>{
 const r=create(emptyScience(),{...draft(),timeBasis:'calendar',time:'2026-10-29T22:00:00+01:00'});assert.equal(r.row.timeH,1);
 for(const time of ['2026-10-29T21:00:00','bad','2026-10-29T19:00:00Z'])assert.ok(create(emptyScience(),{...draft(),timeBasis:'calendar',time}).errors.time);
});
check('Manual validation identifies invalid fields before changing the scientific document',()=>{
 const doc=emptyScience(),before=JSON.stringify(doc);for(const patch of [{time:''},{time:'-1'},{time:'8761'},{value:''},{value:'Infinity'},{value:'-1'},{sd:'0'},{sd:'bad'},{matrixFactor:'0'},{matrixFactor:'11'}]){const r=create(doc,{...draft(),...patch});assert.ok(Object.values(r.errors).some(Boolean),JSON.stringify(patch));assert.equal(JSON.stringify(doc),before);}
 const r=create(doc,{...draft(),time:'',value:'bad',sd:'-1'});assert.ok(r.errors.time&&r.errors.value&&r.errors.sd);
});
check('Alternative matrix entry requires conversion and recorded source assumptions',()=>{
 const d={...draft(),matrix:'saliva'};assert.ok(create(emptyScience(),d).errors.matrixFactor);assert.ok(create(emptyScience(),{...d,matrixFactor:'2'}).errors.conversionSource);
 const r=create(emptyScience(),{...d,matrixFactor:'2',conversionSource:'Declared laboratory paired-sample relationship'});assert.equal(observationValue(r.row),3);assert.match(r.document.observationSource,/saliva × 2 → plasma/);assert.match(r.document.observationSource,/paired-sample/);
});
check('Observation edits preserve roles, upper limits and prior dataset state',()=>{
 const first=create(emptyScience(),draft()).document,before=JSON.stringify(first),second=create(first,{...draft(),qualifier:'<',role:'calibration',value:'2'},'upper-limit').document;assert.equal(second.observations.length,2);assert.equal(second.observations[1].qualifier,'<');assert.equal(second.observations[1].role,'calibration');assert.equal(JSON.stringify(first),before);
 const edited=create(second,{...draft(),value:'4'},'manual-proof').document;assert.equal(edited.observations.length,2);assert.equal(edited.observations[0].value,4);assert.equal(edited.observations[1].id,'upper-limit');
});
check('Manual entry retains authoritative scientific row and dataset limits',()=>{
 for(const patch of [{unit:'wrong'},{role:'training'},{qualifier:'>'},{matrix:'breath',matrixFactor:'1',conversionSource:'Unvalidated'}])assert.ok(create(emptyScience(),{...draft(),...patch}).errors.form);
 const doc=emptyScience();doc.observations=Array.from({length:200},(_,i)=>({...create(emptyScience(),draft()).row,id:'row-'+i}));assert.ok(create(doc,draft()).errors.form);assert.equal(doc.observations.length,200);
});
check('Scientific child routes preserve primary and contextual active states',()=>{
 for(const view of SCIENTIFIC_VIEWS){const s={presentation:{selectedWorkspace:'session',selectedSubview:view}};assert.equal(locationFor(s).group,'analysis');assert.ok(routeActive(s,'session','validation'));assert.equal(locationFor(s).view,view);assert.ok(!routeActive(s,'session','parameters'));}
 assert.equal(locationFor({presentation:{selectedWorkspace:'calculate'}}).view,'inputs');assert.ok(routeActive({presentation:{selectedWorkspace:'session',selectedSubview:''}},'session','timeline'));
});
check('Current, pending, invalid, failed and previous calculation states remain distinct',()=>{
 const s={presentation:{},snapshots:{currentSnapshotId:'proof',relationToDraft:'current'},execution:{status:'complete'},draft:{validation:{status:'valid'}},editingInvalidCount:0};assert.equal(calculationState(s).kind,'current');s.execution.status='running';assert.equal(calculationState(s).kind,'pending');s.editingInvalidCount=1;assert.equal(calculationState(s).kind,'invalid');s.editingInvalidCount=0;s.execution.status='failed';assert.equal(calculationState(s).kind,'failed');s.execution.status='cancelled';s.snapshots.relationToDraft='stale';assert.equal(calculationState(s).kind,'previous');
});
check('v2.1 retains exact v2.0 trajectories, defaults and threshold outcomes',()=>{
 const old=fs.readFileSync(path.join(root,'public/standalone-v2.0.0.html'),'utf8'),v2=new Function(old.match(/<script id="pk-kernel-source" type="text\/plain">([\s\S]*?)<\/script>/)[1]+';return PKCore;')(),now=loadCore();assert.equal(v2.Vi,'2.0.0');assert.equal(now.Vi,'2.1.0');assert.deepEqual(now.St,v2.St);assert.deepEqual(now.bt(90),v2.bt(90));
 const fixtures=[[],[{id:'coffee',label:'Coffee',startTimeH:0,durationMin:15,ethanolGrams:0,caffeineMg:95,servings:1}],[{id:'mixed',label:'Mixed',startTimeH:0,durationMin:30,ethanolGrams:30,caffeineMg:95,servings:1}]];
 for(const events of fixtures){const subject={...structuredClone(v2.St),simulationDurationH:4},a=v2.Mr(structuredClone(subject),structuredClone(events),v2.bt(90)),b=now.Mr(structuredClone(subject),structuredClone(events),now.bt(90));assert.deepEqual(b.analysisPoints,a.analysisPoints);for(const key of ['peakBACGdL','timeOfPeakBACH','peakCaffeineMgL','timeOfPeakCaffeineH','vehicleThresholdOutcome','legalThresholdOutcome','negligibleThresholdOutcome'])assert.deepEqual(b.summary[key],a.summary[key]);}
});
fs.mkdirSync(path.join(root,'test/artifacts'),{recursive:true});const output={passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,results};fs.writeFileSync(path.join(root,'test/artifacts/ux-unit-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({passed:output.passed,failed:output.failed}));if(output.failed)process.exitCode=1;
