import assert from 'node:assert/strict';
import {emptyScience,parseObservations,validateScience,observationValue,observationSD,observationIssues,assertObservationAnalysis} from '../src/science/schema.mjs';
import {manualObservationChange,observationDefaults} from '../src/ui/observation-entry.mjs';
import {visibleIntakeInterval} from '../src/ui/plot-interval.mjs';
import {previewObservations,confirmObservationImport} from '../src/ui/observation-import.mjs';
import {runScience} from '../src/science/analysis.mjs';
import {scientificReport} from '../src/science/report.mjs';
import {v15CurveSVG} from '../src/ui/report.mjs';
const anchor='2026-11-01T12:00:00Z';
for(const [analyte,matrix,unit]of[['caffeine','plasma','mg/L'],['ethanol','whole-blood','g/dL']]){
 for(const factor of ['2','.5'])assert.throws(()=>parseObservations(`time_h,analyte,value,unit,matrix,matrix_factor\n1,${analyte},2,${unit},${matrix},${factor}`,anchor),/CSV row 2.*already in/);
 for(const factor of ['',',1']){const csv=`time_h,analyte,value,unit,matrix${factor?',matrix_factor':''}\n1,${analyte},2,${unit},${matrix}${factor}`;assert.equal(observationValue(parseObservations(csv,anchor)[0]),2);}
}
const doc=emptyScience();doc.observations=[{id:'legacy',timeH:1,analyte:'caffeine',value:2,unit:'mg/L',matrix:'plasma',matrixFactor:2,sd:.1,role:'evaluation',qualifier:'=',label:'Historical row',conversionSource:'Original source'}];
const preserved=validateScience(doc);assert.deepEqual(preserved.observations,doc.observations);assert.equal(observationIssues(preserved).length,1);assert.throws(()=>assertObservationAnalysis(preserved),/Historical row/);
await assert.rejects(runScience({}, {document:preserved,input:{}}),/Resolve canonical-matrix/);
const draft={...observationDefaults(),time:'1',value:'2',matrixFactor:'2'};assert.ok(manualObservationChange(preserved,draft,anchor,{id:'legacy'}).errors.matrixFactor);
const fixed=manualObservationChange(preserved,{...draft,matrixFactor:'1'},anchor,{id:'legacy'});assert.deepEqual(fixed.errors,{});assert.equal(fixed.document.observations[0].value,2);assert.equal(fixed.document.observations[0].matrixFactor,null);assert.equal(doc.observations[0].matrixFactor,2);assertObservationAnalysis(fixed.document);
assert.throws(()=>parseObservations('time_h,analyte,value,unit,matrix,conversion_souce\n1,caffeine,2,mg/L,plasma,lab',anchor),/Unrecognized CSV columns: conversion_souce/);
const csv='time_h,analyte,value,unit,matrix,matrix_factor,sd,conversion_source\n1,caffeine,2000,ng/mL,saliva,1.2,100,Paired sample relationship';
const row=parseObservations(csv,anchor)[0];assert.equal(observationValue(row),2.4);assert.equal(observationSD(row),.12);assert.equal(observationSD({...row,sd:null}),.1);
const preview=previewObservations(emptyScience(),csv,anchor,'Laboratory');assert.equal(preview.rows[0].conversionSource,'Paired sample relationship');assert.throws(()=>confirmObservationImport(emptyScience(),preview,csv+'\n',anchor,'Laboratory'),/stale/);
assert.deepEqual(visibleIntakeInterval({startTimeH:-.5,durationMin:60},24),{start:0,end:.5});assert.equal(visibleIntakeInterval({startTimeH:-1,durationMin:60},24),null);assert.equal(visibleIntakeInterval({startTimeH:-2,durationMin:30},24),null);assert.deepEqual(visibleIntakeInterval({startTimeH:23.5,durationMin:60},24),{start:23.5,end:24});assert.deepEqual(visibleIntakeInterval({startTimeH:0,durationMin:0},24),{start:0,end:0});
const frame={document:{mainScenario:{}},science:preserved};const html=scientificReport(frame,[]);assert.match(html,/Analysis blocked/);assert.match(html,/Canonical concentration/);assert.match(html,/4 mg\/L/);assert.match(html,/0.2 mg\/L/);
const plot=v15CurveSVG({points:[{tH:0,bacGdL:0,caffeineMgL:0},{tH:1,bacGdL:0,caffeineMgL:0}],summary:{}},{events:[{label:'Carryover',startTimeH:-.5,durationMin:60}]});assert.match(plot,/Carryover/);
console.log('PASS v2.1.2 conversion guards, historical preservation, canonical errors, CSV headers, stale review, report and historical interval regressions');
