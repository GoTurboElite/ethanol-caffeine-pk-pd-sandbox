import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {root,core,makeHost} from './host-harness.mjs';
const tests=[];
function check(name,fn){try{const evidence=fn();tests.push({name,passed:true,evidence});console.log('PASS '+name);}catch(error){tests.push({name,passed:false,error:error.stack});console.error('FAIL '+name+' '+error.message);}}
check('deterministic self-contained HTML and embedded build identity',()=>{
 const build=()=>{const r=spawnSync(process.execPath,[path.join(root,'build.mjs')],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return fs.readFileSync(path.join(root,'public','index.html'));};
 const first=build(),second=build();assert.deepEqual(first,second);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'public','build.json'),'utf8'));
 assert.equal(crypto.createHash('sha256').update(first).digest('hex'),manifest.htmlSha256);
 const html=first.toString('utf8'),scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,2);assert.ok(!/<script\b[^>]*\bsrc=/.test(html));
 const embedded=new Function(scripts[0][2]+';return PKCore;')();assert.equal(embedded.qt.buildFingerprint,manifest.buildFingerprint);assert.equal(embedded.Vi,'1.6.0');new vm.Script(scripts[1][2]);
 return {bytes:first.length,htmlSha256:manifest.htmlSha256,buildFingerprint:manifest.buildFingerprint};
});
check('existing schema 0.8.2 scenario remains importable',()=>{const text=fs.readFileSync(path.join(root,'test','legacy','two-episodes.json'),'utf8'),h=makeHost({inputText:text});const parsed=h.run('Dte(inputText)');assert.equal(parsed.ok,true,JSON.stringify(parsed.errors));return {keys:Object.keys(parsed)};});
check('narrative announcement does not repeat the phenotype headline',()=>{
 const input=JSON.parse(fs.readFileSync(path.join(root,'test','legacy','two-episodes.json'),'utf8')).mainScenario;input.doseEvents=[{...input.doseEvents[0],ethanolGrams:0,caffeineMg:95,durationMin:15}];const r=core.Mr(input.subject,input.doseEvents,input.constants),profile=core.hn(),behavior=core.zi(r,input.subject,profile);
 const composed=core.$j({result:r,behavioural:behavior,profile,doseEvents:input.doseEvents,subject:input.subject,selectedTimeH:r.summary.timeOfPeakCaffeineH});assert.ok(composed);assert.ok(!composed.stateNarrative.startsWith(composed.headline+'.'));const words=composed.accessibleAnnouncement.toLowerCase();assert.ok((words.match(/caffeine near peak/g)??[]).length<=1);return {headline:composed.headline,announcement:composed.accessibleAnnouncement};
});
check('subthreshold ethanol is represented as always below the negligible threshold',()=>{const input=JSON.parse(fs.readFileSync(path.join(root,'test','legacy','two-episodes.json'),'utf8')).mainScenario;input.doseEvents=[{...input.doseEvents[0],ethanolGrams:1}];const r=core.Mr(input.subject,input.doseEvents,input.constants);assert.equal(r.summary.negligibleThresholdOutcome.status,'never-exceeded');assert.equal(core.jB(r),0);});
fs.writeFileSync(path.join(root,'test','artifacts','release-results.json'),JSON.stringify({passed:tests.filter(x=>x.passed).length,failed:tests.filter(x=>!x.passed).length,tests},null,2)+'\n');
console.log(JSON.stringify({passed:tests.filter(x=>x.passed).length,failed:tests.filter(x=>!x.passed).length}));
if(tests.some(x=>!x.passed))process.exitCode=1;
