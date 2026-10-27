import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root} from './helpers.mjs';
fs.mkdirSync(path.join(root,'test/artifacts'),{recursive:true});
for(const script of ['test/session.mjs','test/interface.mjs','test/legacy/regression.mjs','test/legacy/state.mjs','test/legacy/release.mjs','test/legacy/embedded.mjs']){
 const result=spawnSync(process.execPath,[path.join(root,script)],{cwd:root,stdio:'inherit'});
 if(result.status!==0)process.exit(result.status??1);
}
