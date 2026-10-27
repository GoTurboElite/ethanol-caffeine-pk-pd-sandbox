import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const shipped=fs.readFileSync(path.join(root,'public','index.html'),'utf8');
export const source=shipped.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
export const core=new Function(shipped.match(/<script id="pk-kernel-source" type="text\/plain">([\s\S]*?)<\/script>/)[1]+';return PKCore;')();
export function functionText(name){const start=source.indexOf('\nfunction '+name+'(')+1;if(!start)throw Error('Missing function '+name);return source.slice(start,source.indexOf('\n}',start)+2);}
export function makeHost(extra={}){
 const context=vm.createContext({...core,PKCore:core,maintenanceMax:core.maintenanceMax,maintenanceMin:core.maintenanceMin,console,Date,URL,Blob,TextEncoder,TextDecoder,structuredClone,setTimeout,clearTimeout,queueMicrotask,...extra});
 const definitions=new Map();
 for(const match of source.matchAll(/^function ([\w$]+)\(/gm)){const firstEnd=source.indexOf('\n',match.index),firstLine=source.slice(match.index,firstEnd);const end=firstLine.trim().endsWith('}')?firstEnd:source.indexOf('\n}',match.index)+2;if(end>match.index)definitions.set(match[1],source.slice(match.index,end));}
 for(const [name,definition] of definitions)if(!(name in context)){try{new vm.Script(definition);vm.runInContext(definition,context);}catch(error){if(!(error instanceof SyntaxError))throw error;}}
 function constantText(name){
   let direct=new RegExp('^const '+name.replace(/[$]/g,'\\$')+'\\s*=', 'm').exec(source);
   if(!direct){const assignment=new RegExp('^  '+name.replace(/[$]/g,'\\$')+'\\s*=', 'm').exec(source);if(!assignment)return null;const index=source.lastIndexOf('\nconst ',assignment.index);if(index<0)return null;direct={index:index+1};}
   let i=direct.index+6,depth=0,quote=null,escaped=false;
   for(;i<source.length;i++){const c=source[i];if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote=null;continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if('([{'.includes(c))depth++;else if(')]}'.includes(c))depth--;else if(c===';'&&depth===0)return source.slice(direct.index,i+1).replace(/^const /,'var ');}
   return null;
 }
 function ensure(name){
   if(name in context&&context[name]!==undefined)return;
   const declaration=definitions.get(name)??constantText(name);
   if(!declaration)throw Error('No isolated host definition for '+name);
   for(let tries=0;tries<100;tries++)try{vm.runInContext(declaration,context);return;}catch(error){const missing=error.message.match(/^([\w$]+) is not defined$/)?.[1];if(!missing)throw error;ensure(missing);}
   throw Error('Dependency loop '+name);
 }
 function run(expression){
   for(let tries=0;tries<150;tries++)try{return vm.runInContext(expression,context);}catch(error){const missing=error.message.match(/^([\w$]+) is not defined$/)?.[1];if(!missing)throw error;console.log('Loading isolated dependency '+missing);ensure(missing);}
   throw Error('Too many isolated host dependencies');
 }
 return {context,ensure,run};
}
