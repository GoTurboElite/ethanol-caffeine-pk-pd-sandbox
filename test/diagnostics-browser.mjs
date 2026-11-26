import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium,firefox,webkit} from 'playwright';
import {root} from './helpers.mjs';
const engine=process.env.TEST_BROWSER??'chromium',browser=await ({chromium,firefox,webkit})[engine].launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(root,'public/standalone-v2.5.0.html')).href);
 const ready=()=>page.waitForFunction(()=>window.__PK_SANDBOX_V2__?.store.state.snapshots.relationToDraft==='current');
 const route=async hash=>{await page.evaluate(h=>{location.hash=h;},hash);await page.waitForFunction(h=>location.hash===h,hash);};
 await ready();await page.getByRole('button',{name:/Add Coffee only, 250 mL serving/}).click();await ready();
 await route('#session/timeline');
 await page.getByRole('button',{name:'Select all events',exact:true}).click();
 await page.getByText('Repeat or remove selected events',{exact:true}).click();
 await page.getByRole('button',{name:'Review repeated series'}).click();
 await page.getByRole('table',{name:'Review repeat operation'}).waitFor();
 const count=()=>page.evaluate(()=>window.__PK_SANDBOX_V2__.store.state.document.mainScenario.doseEvents.length);
 assert.equal(await count(),1);await page.getByRole('button',{name:'Apply reviewed schedule'}).click();await ready();assert.equal(await count(),3);
 await page.getByRole('button',{name:'Undo committed scenario edit'}).click();await ready();assert.equal(await count(),1);
 await route('#session/explain');await page.getByText('Compartment and flux inspector',{exact:true}).click();
 for(const [mode,width] of [['default',390],['detailed',768],['expert',1440]]){
  await page.setViewportSize({width,height:900});await page.getByRole('combobox',{name:'Scientific depth',exact:true}).selectOption(mode);
  await page.getByText(/enter the systemic compartments/).first().waitFor();
  if(mode!=='default'){
   await page.getByRole('combobox',{name:'Mechanistic trajectory'}).selectOption('caffeineElimination');
   await page.getByRole('table',{name:'Mass conservation at the cursor'}).waitFor();
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflow at '+width);
 }
 await page.getByRole('button',{name:'Compare with a refined solver step'}).click();
 await page.getByText('Current convergence diagnostic',{exact:true}).waitFor();
 await route('#session/experiment');
 await page.getByRole('button',{name:'Create experiment from accepted simulation',exact:true}).click();
 await page.locator('#experimental-sweep > summary').click();
 await page.getByLabel('Apply each absolute parameter value to both captured scenarios').check();
 await page.getByLabel('Sweep steps 1',{exact:true}).fill('2');
 await page.getByRole('button',{name:'Run parameter sweep',exact:true}).click();
 await page.getByRole('combobox',{name:'Sweep outcome',exact:true}).selectOption('caffeineSignedAuc');
 const sweep=await page.evaluate(()=>window.__PK_SANDBOX_V2__.experiments.sweep);
 assert.equal(sweep.members.length,2);assert.ok(sweep.members.every(m=>m.comparison.caffeine.signedAuc===0));
 await route('#session/uncertainty');await page.getByRole('combobox',{name:/Observation model/}).selectOption('lognormal');
 await page.getByRole('spinbutton',{name:'caffeine coefficient of variation (fraction)',exact:true}).fill('0.1');
 await page.getByLabel('Uncertainty samples').fill('16');await page.getByRole('button',{name:'Run uncertainty sampling'}).click();
 await page.getByText('Prospective measurement quantiles',{exact:true}).click({timeout:60000});
 await page.getByRole('table',{name:'Pointwise measurements in mg/L'}).waitFor();
 const prediction=await page.evaluate(()=>window.__PK_SANDBOX_V2__.science.resultFor('uncertainty'));
 assert.equal(prediction.configuration.observationError.model,'lognormal');assert.equal(prediction.predictiveGrid.length,97);
 assert.deepEqual(errors,[]);console.log('PASS '+engine+' standalone, reviewed repetition, Undo, three-depth mechanism, phone/tablet/desktop widths, expert solver refinement, common-value sweep and predictive measurement controls.');
}finally{await browser.close();}
