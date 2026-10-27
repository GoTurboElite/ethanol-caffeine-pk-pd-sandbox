import assert from 'node:assert/strict';
// WebKit's emulated offline flag bypasses service-worker navigation in the pinned
// automation build. A stopped origin proves network unavailability for every engine.
// https://github.com/microsoft/playwright/issues/42775
export async function withOriginOutage({server,browser,url},verify){
 const port=Number(new URL(url).port);await new Promise(resolve=>server.close(resolve));
 assert.equal(server.listening,false,'The origin must be stopped before cached navigation.');
 try{
  const clean=await browser.newContext({serviceWorkers:'block'}),page=await clean.newPage();
  try{await assert.rejects(page.goto(url+'/uncached-network-control',{timeout:10000,waitUntil:'domcontentloaded'}),'An uncached context must fail while the origin is stopped.');}finally{await clean.close();}
  return await verify();
 }finally{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{server.removeListener('error',reject);resolve();});});}
}
