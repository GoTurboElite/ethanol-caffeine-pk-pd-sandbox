import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const shipped=()=>fs.readFileSync(path.join(root,'public','index.html'),'utf8');
export const core=()=>new Function(shipped().match(/<script id="pk-kernel-source" type="text\/plain">([\s\S]*?)<\/script>/)[1]+';return PKCore;')();
