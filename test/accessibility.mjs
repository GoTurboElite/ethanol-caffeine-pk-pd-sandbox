import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import {createServer} from '../scripts/serve.mjs';
import {root} from './helpers.mjs';
const playwright=process.env.PLAYWRIGHT_MODULE_PATH?await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH)):await import('playwright');
const engine=process.env.TEST_BROWSER??'chromium',browser=await playwright[engine].launch({headless:true}),context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true}),page=await context.newPage(),results=[],errors=[];
const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
const artifacts=path.join(root,'test/artifacts');fs.mkdirSync(artifacts,{recursive:true});
page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.stack));
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.stack});console.error('FAIL '+name+' '+e.message);await page.screenshot({path:path.join(artifacts,engine+'-ui-failure-'+results.length+'.png')}).catch(()=>{});if(await page.getByRole('dialog').isVisible().catch(()=>false))await page.keyboard.press('Escape').catch(()=>{});}}
async function current(){await page.waitForFunction(()=>window.__PK_SANDBOX_V160__?.store.state.snapshots.relationToDraft==='current',null,{timeout:90000});}
const main=()=>page.getByRole('navigation',{name:'Main workspaces'});
async function overview(){await main().getByRole('link',{name:'Analysis',exact:true}).click();await page.getByRole('heading',{name:'Analysis',exact:true}).waitFor();}
async function settings(){await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('dialog',{name:'Interface preferences'}).waitFor();}
const categories=()=>page.getByRole('group',{name:'Preference categories'});
async function axe(label){
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 const violations=result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
 fs.writeFileSync(path.join(artifacts,engine+'-axe-'+label+'.json'),JSON.stringify(violations,null,2));assert.deepEqual(violations,[],label+": "+JSON.stringify(violations));
}
try{
 await page.goto(url,{waitUntil:'networkidle'});await current();
 await check('Initial route exposes one application shell and separate concentration plots',async()=>{
  assert.ok(page.url().endsWith('#session/overview'));assert.equal(await page.getByRole('main').count(),1);assert.equal(await page.getByRole('heading',{level:1}).count(),1);assert.equal(await main().getByRole('link').count(),4);assert.equal(await page.locator('.v160-plot').count(),2);
  const y=await page.locator('.v160-plot.caffeine').boundingBox();assert.ok(y.y+y.height<930,'Both concentration plots must be visible near the first desktop viewport.');await axe('overview-default-light');const route=page.url();await page.getByRole('link',{name:'Skip to workspace',exact:true}).focus();await page.keyboard.press('Enter');assert.equal(page.url(),route);assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');
 });
 await check('Direct intake dialog focuses the first field, commits once and preserves Undo',async()=>{
  const before=await page.evaluate(()=>window.__PK_SANDBOX_V160__.controller.history.entries.length);
  await page.getByRole('button',{name:'+ Add intake',exact:true}).click();await page.getByRole('dialog',{name:'Add intake',exact:true}).waitFor();assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')??document.activeElement.closest('label')?.textContent.trim()),'Intake label');
  await page.getByLabel('Intake label',{exact:true}).fill('Accessible coffee');await page.getByLabel('Caffeine per serving, mg',{exact:true}).fill('95');await page.getByRole('button',{name:'Add intake to session',exact:true}).click();await current();
  assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V160__.store.state.document.mainScenario.doseEvents.at(-1).caffeineMg),95);assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V160__.controller.history.entries.length),before+1);
  await page.getByRole('button',{name:'Undo committed scenario edit'}).click();await current();assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V160__.store.state.document.mainScenario.doseEvents.length),0);
  await page.getByRole('button',{name:'Redo committed scenario edit'}).click();await current();assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Redo committed scenario edit');
 });
 await check('Search opens an exact parameter with validation and atomic changes',async()=>{
  await page.getByRole('button',{name:'Find a control or parameter'}).click();await page.getByLabel('Search by name, abbreviation or unit').fill('effective caffeine half-life');
  await page.getByRole('button',{name:/Effective caffeine half-life.*subject.caffeineHalfLifeH/}).click();await page.getByRole('dialog',{name:'Effective caffeine half-life',exact:true}).waitFor();
  const control=page.getByLabel('Effective caffeine half-life · h',{exact:true});await control.fill('0');await page.getByRole('button',{name:'Apply parameter',exact:true}).click();await page.getByRole('alert').waitFor();assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V160__.store.state.document.mainScenario.subject.caffeineHalfLifeH),5);
  await control.fill('6');await page.getByRole('button',{name:'Apply parameter',exact:true}).click();await current();assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V160__.store.state.document.mainScenario.subject.caffeineHalfLifeH),6);
 });
 await check('Reading preferences, scientific depth and numerical state remain independent',async()=>{
  const before=await page.evaluate(()=>{const a=window.__PK_SANDBOX_V160__;return{doc:JSON.stringify(a.store.state.document),snapshot:a.store.state.snapshots.currentSnapshotId,runs:a.runtime.metrics.topLevelNumericalInvocations};});
  await settings();await page.getByRole('combobox',{name:'Scientific depth',exact:true}).last().selectOption('expert');await page.getByRole('combobox',{name:'Explanation support',exact:true}).selectOption('concise');await page.getByRole('combobox',{name:'Spacing',exact:true}).selectOption('comfortable');await page.getByRole('combobox',{name:'Text size',exact:true}).selectOption('18');await page.getByLabel('Focus layout: collapse optional context').check();await axe('settings-reading');
  await page.getByRole('button',{name:'Done',exact:true}).click();
  const after=await page.evaluate(()=>{const a=window.__PK_SANDBOX_V160__;return{doc:JSON.stringify(a.store.state.document),snapshot:a.store.state.snapshots.currentSnapshotId,runs:a.runtime.metrics.topLevelNumericalInvocations,depth:a.store.state.presentation.detailMode,prefs:a.preferences.values};});
  assert.equal(after.doc,before.doc);assert.equal(after.snapshot,before.snapshot);assert.equal(after.runs,before.runs);assert.equal(after.depth,'expert');assert.equal(after.prefs.density,'comfortable');assert.equal(after.prefs.textSize,18);assert.equal(after.prefs.focus,true);
 });
 await check('BAC units update both values and labels without changing the scientific document',async()=>{
  const before=await page.evaluate(()=>JSON.stringify(window.__PK_SANDBOX_V160__.store.state.document));await settings();await categories().getByRole('button',{name:'Units',exact:true}).click();await page.getByRole('combobox',{name:'BAC display',exact:true}).selectOption('g/L');await page.getByRole('button',{name:'Done',exact:true}).click();
  assert.ok((await page.locator('.v160-plot.bac').innerText()).includes('g/L'));
  await settings();await categories().getByRole('button',{name:'Profiles',exact:true}).click();const exporting=page.waitForEvent('download');await page.getByRole('button',{name:'Export interface profile',exact:true}).click();const download=await exporting,profileFile=path.join(artifacts,engine+'-interface-profile.json');await download.saveAs(profileFile);assert.equal(JSON.parse(fs.readFileSync(profileFile,'utf8')).display.bacDisplayUnit,'g/L');
  await categories().getByRole('button',{name:'Units',exact:true}).click();await page.getByRole('combobox',{name:'BAC display',exact:true}).selectOption('g/dL');await categories().getByRole('button',{name:'Profiles',exact:true}).click();await page.getByRole('dialog').locator('input[type=file]').setInputFiles(profileFile);await page.waitForFunction(()=>window.__PK_SANDBOX_V160__.store.state.presentation.bacDisplayUnit==='g/L');await page.getByRole('button',{name:'Done',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.stringify(window.__PK_SANDBOX_V160__.store.state.document)),before);
 });
 await check('Dark, light and system preferences reach both new and retained workspaces',async()=>{
  await settings();await categories().getByRole('button',{name:'Appearance',exact:true}).click();await page.getByRole('combobox',{name:'Colour theme',exact:true}).selectOption('clarity-dark');await page.getByRole('button',{name:'Done',exact:true}).click();assert.equal(await page.locator('html').getAttribute('data-v160-theme'),'dark');await axe('overview-expert-dark');
  await main().getByRole('link',{name:'Session',exact:true}).click();await page.getByRole('heading',{name:'Session inputs',exact:true}).waitFor();assert.equal(await page.locator('.v160-legacy-slot > .app-shell').getAttribute('data-theme'),'clarity-dark');assert.equal(await page.getByRole('heading',{level:1}).count(),1);await axe('inputs-dark');
  await settings();await categories().getByRole('button',{name:'Appearance',exact:true}).click();await page.getByRole('combobox',{name:'Colour theme',exact:true}).selectOption('clarity-system');await page.getByRole('button',{name:'Done',exact:true}).click();await page.emulateMedia({colorScheme:'light'});await page.waitForFunction(()=>document.documentElement.dataset.v160Theme==='light');await page.emulateMedia({colorScheme:'dark'});await page.waitForFunction(()=>document.documentElement.dataset.v160Theme==='dark');await page.emulateMedia({colorScheme:'light'});await page.waitForFunction(()=>document.documentElement.dataset.v160Theme==='light');
  for(const theme of ['workbench-light','workbench-dark','royal-vapor-light','royal-vapor-dark','chromatic','clinical','spectral','midnight','manuscript']){await settings();await categories().getByRole('button',{name:'Appearance',exact:true}).click();await page.getByRole('combobox',{name:'Colour theme',exact:true}).selectOption(theme);await page.getByRole('button',{name:'Done',exact:true}).click();await axe('inputs-'+theme);}
 });
 await check('Settings reset preserves session data and direct legacy bookmarks remain navigable',async()=>{
  const before=await page.evaluate(()=>JSON.stringify(window.__PK_SANDBOX_V160__.store.state.document));await settings();await categories().getByRole('button',{name:'Profiles',exact:true}).click();await page.getByRole('button',{name:'Restore interface defaults',exact:true}).click();await page.getByRole('button',{name:'Done',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.stringify(window.__PK_SANDBOX_V160__.store.state.document)),before);
  for(const route of ['#calculate','#session/timeline','#session/explain','#session/parameters','#expert','#results/data','#export']){await page.goto(url+'/'+route);await current();assert.equal(await page.getByRole('main').count(),1);assert.equal(await page.getByRole('heading',{level:1}).count(),1);}
 });
 await check('Remembered optional panels survive navigation and preferences survive reload',async()=>{
  await overview();await page.getByRole('combobox',{name:'Scientific depth',exact:true}).selectOption('default');const summary=page.locator('#overview-intervals > summary');await summary.click();assert.equal(await page.locator('#overview-intervals').getAttribute('open'),'');await main().getByRole('link',{name:'Saved sessions',exact:true}).click();await overview();assert.equal(await page.locator('#overview-intervals').getAttribute('open'),'');await page.reload({waitUntil:'networkidle'});await current();assert.equal(await page.locator('#overview-intervals').getAttribute('open'),'');
 });
 await check('Keyboard search and Escape restore focus predictably',async()=>{
  await page.getByRole('button',{name:'Find a control or parameter'}).focus();await page.keyboard.press('Control+k');await page.getByRole('dialog',{name:'Find a control or parameter'}).waitFor();assert.equal(await page.evaluate(()=>document.activeElement.type),'search');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Find a control or parameter');
 });
 await check('Default, Detailed and Expert analysis pass automated WCAG checks',async()=>{
  await overview();for(const level of ['default','detailed','expert']){await page.getByRole('combobox',{name:'Scientific depth',exact:true}).selectOption(level);await axe('analysis-'+level);}
 });
 await check('Responsive layouts, large reading size and mobile dialogs contain their controls',async()=>{
  for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:1000});for(const route of ['#session/overview','#calculate','#session/timeline','#session/parameters','#session/projects','#help/default']){await page.goto(url+'/'+route);await current();const d=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(d.scroll<=d.width+1,route+' '+JSON.stringify(d));}}
  await page.setViewportSize({width:390,height:844});await overview();await settings();await page.getByRole('combobox',{name:'Text size',exact:true}).selectOption('20');const d=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,dialog:document.querySelector('dialog[open]').getBoundingClientRect().toJSON()}));assert.ok(d.scroll<=d.width+1);assert.ok(d.dialog.right<=d.width);await page.getByRole('button',{name:'Done',exact:true}).click();await page.screenshot({path:path.join(artifacts,engine+'-v160-mobile.png')});
  await page.setViewportSize({width:1440,height:1000});await settings();await categories().getByRole('button',{name:'Profiles',exact:true}).click();await page.getByRole('button',{name:'Restore interface defaults',exact:true}).click();await page.getByRole('button',{name:'Done',exact:true}).click();await page.screenshot({path:path.join(artifacts,engine+'-v160-desktop.png')});
 });
 await check('No unhandled browser errors occurred',()=>assert.deepEqual(errors,[]));
}finally{
 const output={browser:engine,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,errors,results};fs.writeFileSync(path.join(artifacts,engine+'-accessibility-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify({browser:engine,passed:output.passed,failed:output.failed}));await context.close();await browser.close();await new Promise(r=>server.close(r));if(output.failed)process.exitCode=1;
}
