import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {V15_GUIDES,V15_GUIDE_COMMON} from '../src/content/guide.mjs';
import {SCIENCE_GUIDES} from '../src/content/science-guide.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let text='# How to use v2.1\n\nThis is the portable copy of the instructions included in How to use inside the application. The guide level can be selected independently of the interface detail level.\n\n';
for(const [key,guide]of Object.entries(V15_GUIDES)){
 text+='## '+key[0].toUpperCase()+key.slice(1)+'\n\n'+guide.scope+'\n\n';
 text+='### Scientific workbench\n\n';for(const step of SCIENCE_GUIDES[key])text+='#### '+step[0]+'\n\nAction. '+step[1]+'\n\nExpected result. '+step[2]+'\n\nCheck. '+step[3]+'\n\n';
 for(const section of guide.sections){text+='### '+section.title+'\n\n';for(const [i,step]of section.steps.entries())text+='#### '+(i+1)+'. '+step[0]+'\n\nAction. '+step[1]+'\n\nExpected result. '+step[2]+'\n\nCheck. '+step[3]+'\n\n';}
}
text+='## Offline and installation\n\n';
for(const [i,s]of V15_GUIDE_COMMON.offline.entries())text+='### '+(i+1)+'. '+s[0]+'\n\n'+s[1]+'\n\nExpected result. '+s[2]+'\n\n';
text+='## Glossary\n\n';for(const [term,meaning]of V15_GUIDE_COMMON.glossary)text+='**'+term+'.** '+meaning+'\n\n';
text+='## Troubleshooting\n\n';for(const [issue,answer]of V15_GUIDE_COMMON.troubleshooting)text+='**'+issue+'** '+answer+'\n\n';
fs.mkdirSync(path.join(root,'docs'),{recursive:true});fs.writeFileSync(path.join(root,'docs/HOW_TO_USE.md'),text,'utf8');
console.log('Generated docs/HOW_TO_USE.md from the in-app guide.');
