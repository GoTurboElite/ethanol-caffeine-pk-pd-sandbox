import fs from 'node:fs';
import path from 'node:path';
import {root,makeHost} from './host-harness.mjs';
const host=makeHost();
let result;
for(let attempt=0;attempt<100;attempt++){
 result=host.run('Ane()');
 const missing=[...new Set(result.checks.filter(c=>!c.passed).map(c=>c.detail.match(/^([\w$]+) is not defined$/)?.[1]).filter(Boolean))];
 if(!missing.length)break;
 for(const name of missing)host.ensure(name);
}
fs.writeFileSync(path.join(root,'test','artifacts','embedded-results.json'),JSON.stringify({...result,environment:'isolated deployed diagnostic functions in Node; mounted DOM assertions unavailable'},null,2)+'\n');
console.log(JSON.stringify({passed:result.passCount,failed:result.failed,failures:result.checks.filter(c=>!c.passed)},null,2));
if(result.failed)process.exitCode=1;
