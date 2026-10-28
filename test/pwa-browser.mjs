import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {root} from './helpers.mjs';
import {createServer} from '../scripts/serve.mjs';
import {withOriginOutage} from './outage.mjs';
const playwright=process.env.PLAYWRIGHT_MODULE_PATH?await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH)):await import('playwright');
const engine=process.env.TEST_BROWSER??'chromium',artifacts=path.join(root,'test/artifacts');
fs.mkdirSync(artifacts,{recursive:true});
const directory=fs.mkdtempSync(path.join(artifacts,'pwa-'+engine+'-'));
fs.cpSync(path.join(root,'public'),directory,{recursive:true});
const originalSW=fs.readFileSync(path.join(directory,'sw.js'),'utf8');
const server=createServer(directory,{htmlRedirects:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port;
const browser=await playwright[engine].launch({headless:true}),context=await browser.newContext(),page=await context.newPage(),results=[];
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(error){results.push({name,passed:false,error:error.stack});console.error('FAIL '+name+' '+error.message);}}
try{
 await page.goto(url,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__PK_SANDBOX_V15__?.pwa.state.status==='ready'&&navigator.serviceWorker.controller,null,{timeout:60000});
 await check('Cached navigation survives Cloudflare-style HTML redirects',async()=>{
  const redirect=await fetch(url+'/index.html',{redirect:'manual'});assert.equal(redirect.status,308);
  assert.equal(await page.evaluate(async()=>{const keys=await caches.keys();for(const key of keys){const cache=await caches.open(key),response=await cache.match('./index.html');if(response)return response.redirected;}return false;}),true);
  await page.reload({waitUntil:'networkidle'});
  for(const route of ['/index.html','/standalone-v2.0.0.html','/standalone-v2.0.0','/']){
   await page.goto(url+route,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>window.__PK_SANDBOX_V15__?.store.state.snapshots.relationToDraft==='current');
  }
 });
 await check('Standalone delivery computes without registering its own offline worker',async()=>{
  const isolated=await browser.newContext(),tab=await isolated.newPage();await tab.goto(url+'/standalone-v2.0.0.html',{waitUntil:'networkidle'});
  await tab.waitForFunction(()=>window.__PK_SANDBOX_V15__?.store.state.snapshots.relationToDraft==='current');
  assert.equal(await tab.evaluate(()=>window.__PK_SANDBOX_V15__.pwa.state.status),'standalone');
  assert.equal(await tab.evaluate(async()=>(await navigator.serviceWorker.getRegistrations()).length),0);
  await isolated.close();
 });
 await check('A waiting application update saves and restores committed inputs and markers',async()=>{
  await page.evaluate(()=>{const a=window.__PK_SANDBOX_V15__;a.store.field('title','Preserved through update');a.controller.addMarker({label:'Update proof',kind:'custom',timeH:2});});
  await page.waitForFunction(()=>window.__PK_SANDBOX_V15__.store.state.snapshots.relationToDraft==='current');
  fs.writeFileSync(path.join(directory,'sw.js'),originalSW.replace(/const CACHE='([^']+)'/,"const CACHE='$1-update-proof'"));
  const html=fs.readFileSync(path.join(directory,'index.html'),'utf8').replace('<html lang="en"','<html data-update-proof="yes" lang="en"');
  fs.writeFileSync(path.join(directory,'index.html'),html);
  await page.evaluate(()=>window.__PK_SANDBOX_V15__.pwa.check());
  await page.waitForFunction(()=>!!window.__PK_SANDBOX_V15__.pwa.state.waiting,null,{timeout:60000});
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.evaluate(()=>window.__PK_SANDBOX_V15__.pwa.activate())]);
  await page.waitForFunction(()=>window.__PK_SANDBOX_V15__?.controller.message.includes('restored after'));
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.updateProof),'yes');
  assert.equal(await page.evaluate(()=>window.__PK_SANDBOX_V15__.store.state.document.title),'Preserved through update');
  assert.ok(await page.evaluate(()=>window.__PK_SANDBOX_V15__.controller.markers.some(m=>m.label==='Update proof')));
 });
 await check('Interrupted update installation retains the working cache and active version',async()=>{
  const previous=await page.evaluate(()=>navigator.serviceWorker.controller.scriptURL);
  const bad=originalSW.replace(/const CACHE='([^']+)'/,"const CACHE='$1-interrupted-proof'").replace("const ASSETS=[","const ASSETS=['./missing-installation-asset',");
  fs.writeFileSync(path.join(directory,'sw.js'),bad);
  const outcome=await page.evaluate(async()=>{
   const r=window.__PK_SANDBOX_V15__.pwa.state.registration;
   const event=new Promise(resolve=>r.addEventListener('updatefound',()=>{const w=r.installing;w.addEventListener('statechange',()=>{if(['redundant','activated'].includes(w.state))resolve(w.state);});},{once:true}));
   await r.update();return Promise.race([event,new Promise((_,reject)=>setTimeout(()=>reject(Error('Update installation did not settle')),45000))]);
  });
  assert.equal(outcome,'redundant');
  assert.equal(await page.evaluate(()=>navigator.serviceWorker.controller.scriptURL),previous);
  await withOriginOutage({server,browser,url},async()=>{await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.__PK_SANDBOX_V15__);
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.updateProof),'yes');});
 });
 await check('Cache read failures fall back to network and preserve saved sessions',async()=>{
  const fallbackDirectory=fs.mkdtempSync(path.join(artifacts,'pwa-cache-failure-'+engine+'-'));
  fs.cpSync(path.join(root,'public'),fallbackDirectory,{recursive:true});
  const injection="self.addEventListener('fetch',event=>{if(event.request.mode==='navigate')caches.open=()=>Promise.reject(new DOMException('Injected cache read failure','SecurityError'));});\n";
  fs.writeFileSync(path.join(fallbackDirectory,'sw.js'),injection+originalSW);
  const fallbackServer=createServer(fallbackDirectory,{htmlRedirects:true});await new Promise(r=>fallbackServer.listen(0,'127.0.0.1',r));
  const isolated=await browser.newContext(),tab=await isolated.newPage();
  try{
   await tab.goto('http://127.0.0.1:'+fallbackServer.address().port,{waitUntil:'networkidle'});
   await tab.waitForFunction(()=>window.__PK_SANDBOX_V15__?.pwa.state.status==='ready'&&navigator.serviceWorker.controller);
   await tab.evaluate(async()=>{localStorage.setItem('pkpd-cache-failure-proof','preserved');await window.__PK_SANDBOX_V15__.controller.saveNamed('Cache failure proof');});
   await tab.reload({waitUntil:'networkidle'});
   await tab.waitForFunction(()=>window.__PK_SANDBOX_V15__?.store.state.snapshots.relationToDraft==='current');
   const after=await tab.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
   assert.equal(after['pkpd-cache-failure-proof'],'preserved');
   await tab.waitForFunction(()=>window.__PK_SANDBOX_V15__.controller.projects.some(p=>p.label==='Cache failure proof'));
  }finally{await isolated.close();await new Promise(r=>fallbackServer.close(r));}
 });
}finally{
 const output={browser:engine,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results};
 fs.writeFileSync(path.join(artifacts,engine+'-pwa-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify(output));
 await context.close();await browser.close();await new Promise(r=>server.close(r));if(output.failed)process.exitCode=1;
}
