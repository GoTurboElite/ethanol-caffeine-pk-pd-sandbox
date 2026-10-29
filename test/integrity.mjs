import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {caffeineText} from '../src/ui/units.mjs';
import {root} from './helpers.mjs';
import {acceptedState,portableInspection} from '../src/session/accepted.mjs';
import {V15Controller} from '../src/session/controller.mjs';
import {V15History,v15Stable} from '../src/session/core.mjs';
import {emptyScience,validateScience,validateObservation,observationValue,observationSD} from '../src/science/schema.mjs';
import {manualObservationChange,observationDefaults} from '../src/ui/observation-entry.mjs';
import {previewObservations,confirmObservationImport} from '../src/ui/observation-import.mjs';
import {datasetReference,configurationChanged,scientificResultState} from '../src/ui/scientific-state.mjs';
const results=[],check=(name,fn)=>{try{fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+' '+e.stack);}};
const anchor='2026-10-29T20:00:00Z',csv='time_h,analyte,value,unit,matrix,role,sd,qualifier,matrix_factor,conversion_source\n1,caffeine,2,mg/L,plasma,calibration,.1,=,,\n2,ethanol,20,mg/dL,serum,evaluation,2,<,.9,Paired laboratory relationship';
const draft=(factor='2',source='Relationship A')=>({...observationDefaults(),time:'1',value:'2',matrix:'saliva',matrixFactor:factor,conversionSource:source});
const add=(doc,d,id='active')=>{const r=manualObservationChange(doc,d,anchor,{id});assert.deepEqual(r.errors,{});return r.document;};
check('Accepted selector attributes all quantities to the snapshot despite a different draft and cached accepted input',()=>{
 const input={subject:{bodyMassKg:90,simulationDurationH:12,foodState:'light meal',caffeineHalfLifeH:5},constants:{volume:1},doseEvents:[{id:'old',startTimeH:0}]},draftInput=structuredClone(input);draftInput.subject.bodyMassKg=110;draftInput.subject.simulationDurationH=4;draftInput.doseEvents[0].startTimeH=3;
 const state={document:{mainScenario:draftInput},accepted:{canonicalScenario:draftInput},presentation:{selectedTimeH:11.5},snapshots:{relationToDraft:'stale'},editingInvalidCount:0},snapshot={snapshotId:'accepted',canonicalScenario:input,numerical:{summary:{horizonH:12}}},r=acceptedState(state,snapshot);
 assert.equal(r.input,input);assert.equal(r.horizon,12);assert.equal(r.time,11.5);assert.equal(r.current,false);assert.ok(r.changes.some(c=>c.label==='Body mass (kg)'&&c.accepted==='90'&&c.draft==='110'));assert.ok(r.changes.some(c=>c.label==='Intake schedule'));assert.equal(r.label,'Previous accepted inputs');
 const store={state,field(name,value){this.state.presentation={...this.state.presentation,...value};}};V15Controller.prototype.inspect.call({store,bridge:{snapshot:()=>snapshot}},12);assert.equal(state.presentation.selectedTimeH,12);assert.throws(()=>V15Controller.prototype.inspect.call({store,bridge:{snapshot:()=>snapshot}},12.01),/accepted calculation horizon/);
});
check('Portable cursors remain compatible with a shorter editable draft without changing the model document',()=>{
 const frame={document:{mainScenario:{subject:{simulationDurationH:4},doseEvents:[]}},presentation:{selectedTimeH:12}},before=v15Stable(frame.document);portableInspection(frame);assert.equal(frame.presentation.selectedTimeH,4);assert.equal(v15Stable(frame.document),before);
});
check('CSV review is nonmutating and reports roles, analytes, range, units, matrices, SDs and censoring',()=>{
 const doc=emptyScience(),before=v15Stable(doc),p=previewObservations(doc,csv,anchor,'Clinical assay');assert.equal(v15Stable(doc),before);assert.deepEqual({...p.summary,alternative:undefined},{count:2,existing:0,calibration:1,evaluation:1,ethanol:1,caffeine:1,minTime:1,maxTime:2,units:['mg/L','mg/dL'],matrices:['plasma','serum'],suppliedSD:2,censored:1,alternative:undefined});assert.equal(p.summary.alternative[0].matrixFactor,.9);assert.equal(p.summary.alternative[0].conversionSource,'Paired laboratory relationship');
 const next=confirmObservationImport(doc,p,csv,anchor,'Clinical assay');assert.equal(next.observations.length,2);assert.equal(next.observationSource,'Clinical assay');assert.equal(doc.observations.length,0);
});
check('CSV previews reject stale text, provenance, anchor and same-sized changed datasets',()=>{
 const doc=emptyScience(),p=previewObservations(doc,csv,anchor,'Source');for(const [text,zero,source] of [[csv+'\n',anchor,'Source'],[csv,'2026-10-30T20:00:00Z','Source'],[csv,anchor,'Changed']])assert.throws(()=>confirmObservationImport(doc,p,text,zero,source),/stale/);
 const changed=structuredClone(doc);changed.observations=[p.rows[0]];assert.throws(()=>confirmObservationImport(changed,p,csv,anchor,'Source'),/stale/);const p2=previewObservations(changed,csv,anchor,'Source');changed.observations[0].value=3;assert.throws(()=>confirmObservationImport(changed,p2,csv,anchor,'Source'),/stale/);
});
check('CSV replacement preserves unrelated latest scientific configuration and explicit historical notes',()=>{
 const doc=emptyScience();doc.legacyConversionNotes='Historical relationship';const p=previewObservations(doc,csv,anchor,'Source'),changed=structuredClone(doc);changed.uncertainty.seed=123;const result=confirmObservationImport(changed,p,csv,anchor,'Source');assert.equal(result.uncertainty.seed,123);assert.equal(result.legacyConversionNotes,'Historical relationship');
});
check('CSV review retains atomic rejection, row diagnostics, size and 200-row limits',()=>{
 const doc=emptyScience(),before=v15Stable(doc);for(const text of ['time_h,analyte,value,unit,matrix\n1,caffeine,bad,mg/L,plasma','time_h,analyte,value,unit,matrix\n1,caffeine,2,bad,plasma','time_iso,analyte,value,unit,matrix\n2026-10-29T21:00:00,caffeine,2,mg/L,plasma'])assert.throws(()=>previewObservations(doc,text,anchor,'Source'),/CSV row 2/);
 const header='time_h,analyte,value,unit,matrix\n',row='1,caffeine,2,mg/L,plasma\n';assert.equal(previewObservations(doc,header+row.repeat(200),anchor,'Source').rows.length,200);assert.throws(()=>previewObservations(doc,header+row.repeat(201),anchor,'Source'),/200 rows/);assert.throws(()=>previewObservations(doc,' '.repeat(200001),anchor,'Source'),/200,000/);assert.equal(v15Stable(doc),before);
});
check('Calendar CSV previews use the captured anchor and explicit offsets',()=>{
 const p=previewObservations(emptyScience(),'time_iso,analyte,value,unit,matrix\n2026-10-29T22:00:00+01:00,caffeine,2,mg/L,plasma',anchor,'Source');assert.equal(p.rows[0].timeH,1);
});
check('Conversion source follows successive row edits, native-matrix replacement and deletion',()=>{
 const doc=emptyScience();doc.observationSource='User-authored laboratory protocol';const first=add(doc,draft()),next=add(first,draft('3','Relationship B'));assert.equal(next.observations[0].conversionSource,'Relationship B');assert.equal(next.observations[0].matrixFactor,3);assert.equal(next.observationSource,doc.observationSource);assert.ok(!JSON.stringify(next).includes('Relationship A'));
 const native=add(next,{...observationDefaults(),time:'1',value:'2'});assert.equal(native.observations[0].matrixFactor,null);assert.equal(native.observations[0].conversionSource,'');const deleted=validateScience({...next,observations:[]});assert.ok(!JSON.stringify(deleted).includes('Relationship B'));assert.equal(deleted.observationSource,doc.observationSource);
});
check('Conversion provenance participates in Undo/Redo and JSON round trips',()=>{
 const a=add(emptyScience(),draft()),b=add(a,draft('3','Relationship B')),history=new V15History({science:a});history.push({science:b},'Changed factor',100000);assert.equal(history.undo().science.observations[0].conversionSource,'Relationship A');assert.equal(history.redo().science.observations[0].conversionSource,'Relationship B');assert.deepEqual(validateScience(JSON.parse(JSON.stringify(b))),b);
});
check('Scientific schema 1.0 migration preserves authored source, active assumptions and superseded history',()=>{
 const old={...emptyScience(),schemaVersion:'1.0.0',observations:[{...draft(),id:'active',timeH:1,value:2,matrixFactor:3,unit:'mg/L',analyte:'caffeine',sd:.1,role:'evaluation',qualifier:'='}],observationSource:'User protocol\nMatrix conversion for active: saliva × 2 → plasma. Relationship A\nMatrix conversion for active: saliva × 3 → plasma. Relationship B\nMatrix conversion for deleted: serum × 1.2 → plasma. Historical deleted source'};delete old.legacyConversionNotes;const before=v15Stable(old),m=validateScience(old);assert.equal(m.schemaVersion,'1.1.0');assert.equal(m.observationSource,'User protocol');assert.equal(m.observations[0].conversionSource,'Relationship B');assert.match(m.legacyConversionNotes,/Relationship A/);assert.match(m.legacyConversionNotes,/Historical deleted source/);assert.equal(observationValue(m.observations[0]),6);assert.equal(observationSD(m.observations[0]),observationSD(old.observations[0]));assert.equal(v15Stable(old),before);assert.deepEqual(validateScience(m),m);
});
check('New provenance fields are validated and unknown document versions are rejected',()=>{
 assert.throws(()=>validateObservation({...add(emptyScience(),draft()).observations[0],conversionSource:'x'.repeat(1001)}),/conversion source/);assert.throws(()=>validateScience({...emptyScience(),legacyConversionNotes:42}),/Historical conversion/);assert.throws(()=>validateScience({...emptyScience(),schemaVersion:'9.0.0'}),/Unsupported/);
});
check('Scientific state identities change for edits and distinguish imported archives and editor-only changes',()=>{
 const a=emptyScience(),b=add(a,draft());assert.notEqual(datasetReference(a),datasetReference(b));assert.equal(scientificResultState({sourceKey:'a'},'a'),'Matches committed inputs');assert.match(scientificResultState({sourceKey:'a'},'b'),/Previous/);assert.match(scientificResultState({sourceKey:'a',imported:true},'a'),/Imported archive/);assert.equal(configurationChanged(a,'fit',{parameters:[{id:'caffeineHalfLifeH',lower:'1',upper:'12'}],maxEvaluations:'120'}),false);assert.equal(configurationChanged(a,'fit',{...a.fit,maxEvaluations:121}),true);
});
check('Small positive caffeine values retain a visible nonzero interpretation',()=>{assert.equal(caffeineText(.0001),'<0.01');assert.equal(caffeineText(0),'0');assert.equal(caffeineText(1.25),'1.25');assert.throws(()=>validateScience({...emptyScience(),schemaVersion:'1.0.0',observationSource:42}),/Observation provenance/);});
fs.mkdirSync(path.join(root,'test/artifacts'),{recursive:true});const output={passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length,results};fs.writeFileSync(path.join(root,'test/artifacts/integrity-unit-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({passed:output.passed,failed:output.failed}));if(output.failed)process.exitCode=1;
