import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {root} from './helpers.mjs';
const expected=JSON.parse(fs.readFileSync(path.join(root,'public/build.json'),'utf8'));
const productionHost='pkpd.goturbo.one',projectHost='ethanol-caffeine-pk-pd-sandbox.pages.dev';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function deploymentURL(){
 if(process.env.DEPLOYMENT_URL)return new URL(process.env.DEPLOYMENT_URL);
 const repository=process.env.GITHUB_REPOSITORY,commit=process.env.DEPLOYMENT_COMMIT;
 if(!/^[\w.-]+\/[\w.-]+$/.test(repository??'')||!/^[a-f0-9]{40}$/.test(commit??''))throw Error('Preview lookup requires an exact repository and commit.');
 const headers={Accept:'application/vnd.github+json'};
 if(process.env.GITHUB_TOKEN)headers.Authorization='Bearer '+process.env.GITHUB_TOKEN;
 for(let attempt=0;attempt<36;attempt++){
  const response=await fetch('https://api.github.com/repos/'+repository+'/commits/'+commit+'/check-runs',{headers,signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error('Preview lookup: HTTP '+response.status);
  const body=await response.json(),check=body.check_runs.find(x=>/Cloudflare Pages/i.test(x.name)&&x.conclusion==='success');
  const links=(check?.output?.summary??'').match(/https:\/\/[a-z0-9-]+\.ethanol-caffeine-pk-pd-sandbox\.pages\.dev\/?/gi);
  if(links?.length)return new URL(links[0]);
  await pause(5000);
 }
 throw Error('Cloudflare preview for this commit did not become ready.');
}
const base=await deploymentURL();
if(base.protocol!=='https:'||!(base.hostname===productionHost||base.hostname===projectHost||base.hostname.endsWith('.'+projectHost)))throw Error('Unexpected deployment host.');
let ready=false;
for(let attempt=0;attempt<36;attempt++){
 try{const response=await fetch(new URL('build.json',base),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(response.ok&&(await response.json()).buildFingerprint===expected.buildFingerprint){ready=true;break;}}catch{}
 await pause(5000);
}
assert.ok(ready,'Hosted build did not match the checked commit.');
const playwright=process.env.PLAYWRIGHT_MODULE_PATH?await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH)):await import('playwright');
const engine=process.env.TEST_BROWSER??'chromium',browser=await playwright[engine].launch({headless:true});
const errors=[],failedRequests=[];
try{
 const context=await browser.newContext(),page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 page.on('requestfailed',request=>failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
 const current=()=>page.waitForFunction(fp=>window.__PK_SANDBOX_V15__?.versions.buildFingerprint===fp&&window.__PK_SANDBOX_V15__.store.state.snapshots.relationToDraft==='current',expected.buildFingerprint,{timeout:90000});
 const inputs=async()=>{assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V2__.version),expected.appVersion);assert.ok(await page.getByRole('region',{name:'Model assumptions and next steps'}).isVisible());assert.equal(new URL(page.url()).hash,'#calculate');assert.equal(await page.getByRole('navigation',{name:'Main workspaces'}).getByRole('link',{name:'Session',exact:true}).getAttribute('aria-current'),'page');assert.ok(await page.locator('#calculator-drinks').isVisible());assert.ok(await page.locator('#calculator-estimate').isVisible());};
 await page.goto(base.href,{waitUntil:'networkidle'});await current();assert.equal(new URL(page.url()).hostname,base.hostname,'Deployment origin must remain independently accessible.');
 await inputs();
 await page.waitForFunction(()=>navigator.serviceWorker.controller&&window.__PK_SANDBOX_V15__.pwa.state.status==='ready',null,{timeout:60000});
 for(let i=0;i<2;i++){await page.reload({waitUntil:'networkidle'});await current();await inputs();assert.ok(await page.evaluate(()=>!!navigator.serviceWorker.controller));}
 await page.evaluate(()=>{const a=window.__PK_SANDBOX_V2__,f=a.controller.capture();f.document.mainScenario.doseEvents=[{id:'hosted-preview-proof',label:'Hosted input preview',startTimeH:0,durationMin:30,ethanolGrams:30,caffeineMg:95,servings:1}];a.controller.restore(f,'Hosted input preview verification');});await current();
 assert.ok(await page.locator('#calculator-estimate .bac-severity-ring').isVisible());assert.ok(await page.locator('#calculator-estimate .timeline-svg').isVisible());
 await page.evaluate(()=>{location.hash='#session/observations';});
 const bulk=page.locator('#observation-csv');await bulk.waitFor();if(await bulk.getAttribute('open')===null)await bulk.locator(':scope > summary').click();
 const initialDataset=await page.evaluate(()=>JSON.stringify(window.__PK_SANDBOX_V2__.science.document));
 await page.getByLabel('Observation CSV',{exact:true}).fill('time_h,analyte,value,unit,matrix,matrix_factor,conversion_source,label\n1,caffeine,1,mg/L,saliva,2,Hosted conversion source,Hosted measured sample');
 await page.getByRole('button',{name:'Validate CSV for review',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.stringify(window.__PK_SANDBOX_V2__.science.document)),initialDataset);
 assert.ok(await page.getByRole('region',{name:'Observation CSV review'}).isVisible());await page.getByRole('button',{name:'Confirm replacement with 1 observations',exact:true}).click();
 await page.waitForFunction(()=>window.__PK_SANDBOX_V2__.science.document.observations.length===1);assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V2__.science.document.observations[0].conversionSource),'Hosted conversion source');
 await page.evaluate(()=>{const a=window.__PK_SANDBOX_V2__,p=a.controller.project(true);a.controller.importObject(p);});await current();assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V2__.science.document.schemaVersion),'1.1.0');assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V2__.science.document.observations[0].matrixFactor),2);
 await page.evaluate(()=>{location.hash='#calculate';});
 await page.goto(new URL('index.html',base).href,{waitUntil:'networkidle'});await current();
 await page.goto(new URL('standalone-v2.1.1.html',base).href,{waitUntil:'networkidle'});await current();
 await inputs();
 assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V15__.pwa.state.status),'standalone');
 assert.deepEqual(errors,[]);assert.deepEqual(failedRequests,[]);
 console.log(JSON.stringify({browser:engine,url:base.href,buildFingerprint:expected.buildFingerprint,cachedReloads:2,indexAlias:true,standaloneAlias:true,csvReview:true,observationProvenance:true,sessionRoundTrip:true,errors,failedRequests,verifiedAt:new Date().toISOString()},null,2));
}finally{await browser.close();}
