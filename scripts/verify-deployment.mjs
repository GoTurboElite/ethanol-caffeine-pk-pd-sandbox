import fs from 'node:fs';
import {createHash} from 'node:crypto';
const expected=JSON.parse(fs.readFileSync(new URL('../public/build.json',import.meta.url),'utf8'));
const base=new URL(process.env.DEPLOYMENT_URL??'https://ethanol-caffeine-pk-pd-sandbox.pages.dev/');
if(base.protocol!=='https:'&&base.hostname!=='127.0.0.1')throw Error('Deployment verification requires HTTPS.');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function get(file){const response=await fetch(new URL(file,base),{cache:'no-store',signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(file+': HTTP '+response.status);return Buffer.from(await response.arrayBuffer());}
async function verify(){
 const manifest=JSON.parse((await get('build.json')).toString());
 for(const key of ['appVersion','engineVersion','constantsVersion','schemaVersion','sessionSchemaVersion','buildFingerprint','htmlSha256','standaloneSha256'])if(manifest[key]!==expected[key])throw Error('Deployment is not current: '+key);
 const hosted=await get('index.html'),standalone=await get('standalone-v'+expected.appVersion+'.html'),sw=await get('sw.js');
 if(hash(hosted)!==expected.htmlSha256)throw Error('Hosted HTML hash differs from the checked release.');
 if(hash(standalone)!==expected.standaloneSha256)throw Error('Standalone HTML hash differs from the checked release.');
 const expectedSW=fs.readFileSync(new URL('../public/sw.js',import.meta.url));if(hash(sw)!==hash(expectedSW))throw Error('Service worker differs from the checked release.');
 console.log(JSON.stringify({url:base.href,appVersion:manifest.appVersion,buildFingerprint:manifest.buildFingerprint,hostedSha256:hash(hosted),standaloneSha256:hash(standalone),serviceWorkerSha256:hash(sw),verifiedAt:new Date().toISOString()},null,2));
}
const attempts=process.env.CI?18:1;let error;
for(let i=0;i<attempts;i++){try{await verify();error=null;break;}catch(e){error=e;console.error(e.message);if(i<attempts-1)await new Promise(r=>setTimeout(r,10000));}}
if(error)throw error;
