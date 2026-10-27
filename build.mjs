import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const esbuild=process.env.ESBUILD_MODULE_PATH?await import(pathToFileURL(process.env.ESBUILD_MODULE_PATH)):await import('esbuild');
const read=name=>fs.readFileSync(path.join(root,name),'utf8').replace(/\r\n/g,'\n');
function files(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]);}
const sourceFiles=files('src').sort(),digest=crypto.createHash('sha256');
for(const name of sourceFiles){const content=/\.(?:js|mjs|jsx|css|html|txt|svg)$/.test(name)?read(name):fs.readFileSync(path.join(root,name));digest.update(name).update('\0').update(content).update('\0');}
const fingerprint=digest.digest('hex');
const session=await esbuild.build({absWorkingDir:root,entryPoints:['src/ui/index.jsx'],bundle:true,format:'iife',globalName:'PKPDV15',target:'es2020',jsxFactory:'h',jsxFragment:'Fragment',write:false,minify:false,legalComments:'none'});
let engine=read('src/legacy/engine.js').replace(/(\bVi\s*=\s*")1\.0\.1(")/,(_,a,b)=>a+'1.6.0'+b).replaceAll('__MAINTENANCE_BUILD_FINGERPRINT__',fingerprint).replace('buildDate: "2026-10-22"','buildDate: "2026-10-27"');
if(!/Vi\s*=\s*"1\.6\.0"/.test(engine))throw Error('Application version patch did not match the retained kernel.');
let app=read('src/legacy/app.js');
const replace=(from,to)=>{if(!app.includes(from))throw Error('Missing integration seam: '+from.slice(0,90));app=app.replace(from,to);};
replace('const tne = ["calculate", "results", "behaviour", "explore", "expert", "export"];','const tne = ["calculate", "results", "behaviour", "explore", "expert", "export", "session", "help"];');
replace('settings: this.state.presentation,',"settings: {...this.state.presentation,selectedWorkspace:['calculate','results','behaviour','explore','expert','export'].includes(this.state.presentation.selectedWorkspace)?this.state.presentation.selectedWorkspace:'calculate',selectedSubview:this.state.presentation.selectedWorkspace==='session'||this.state.presentation.selectedWorkspace==='help'?'':this.state.presentation.selectedSubview},");
const anchorStart=app.indexOf('    const _ = Ar.current;'),anchorEnd=app.indexOf('  }, [ct]),',anchorStart);
if(anchorStart<0||anchorEnd<0)throw Error('Missing fixed-anchor integration seam.');
app=app.slice(0,anchorStart)+"    Ar.current=ct;\n    C(re=>({...re,referencedFirstIntakeId:ct?.id??null,timeReferenceBasis:'model-time-zero'}));\n"+app.slice(anchorEnd);
app=app.replace(/Vi === "1\.0\.1"/g,'Vi === "1.6.0"').replace(/qt\.appVersion === "1\.0\.1"/g,'qt.appVersion === "1.6.0"');
const releaseNote=read('src/content/releases.js');
const surfaceEffect="  M.useEffect(()=>{const fn=event=>{const surface=event.detail?.surface;if(surface==='person')pe(true);else if(surface==='timeline')Qe(true);else if(['about','scenario'].includes(surface))Z(surface);};window.addEventListener('pkpd-ui-action',fn);return()=>window.removeEventListener('pkpd-ui-action',fn);},[]);\n";
const effectAt=app.indexOf('  M.useEffect(',app.indexOf('function hne()'));if(effectAt<0)throw Error('Missing workbench action seam.');app=app.slice(0,effectAt)+surfaceEffect+app.slice(effectAt);
app=app.replace('return r.jsxs("main", {\n      className: "app-shell invalid-run-shell",','return r.jsxs("div", {\n      className: "app-shell invalid-run-shell",').replace('return r.jsxs("main", {\n    className: "app-shell v5-shell v7-shell",','return r.jsxs("div", {\n    className: "app-shell v5-shell v7-shell",');

replace('let appRoot=null;',read('src/bridge.js')+'\n'+releaseNote+'\nlet appRoot=null;');
replace('children: r.jsx(hne, {})','children: r.jsx(V15Integration.Shell,{legacy:r.jsx(hne,{})})');
const scripts=session.outputFiles[0].text+'\n'+app;
new Function(engine+';return PKCore;');new Function(scripts);
const css=read('src/legacy/styles.css')+'\n'+read('src/ui/styles.css'),head=read('src/legacy/head.html').replace('v1.0.1','v1.6.0');
function html(delivery){
 const extra=delivery==='hosted'?'<link rel="manifest" href="./manifest.webmanifest"><meta name="theme-color" content="#6552bc"><link rel="icon" href="./icons/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="./icons/icon-192.png">':'<meta name="theme-color" content="#6552bc">';
 return '<!doctype html>\n<html lang="en" data-delivery="'+delivery+'"><head>'+head+extra+'\n<style>'+css+'</style>\n<script id="pk-kernel-source" type="text/plain">'+engine+'</script>\n<script type="module">'+scripts+'</script>\n</head><body><div id="root"></div></body></html>\n';
}
const output=path.join(root,'public');fs.mkdirSync(output,{recursive:true});
const hosted=html('hosted'),standalone=html('standalone');
fs.writeFileSync(path.join(output,'index.html'),hosted);fs.writeFileSync(path.join(output,'standalone-v1.6.0.html'),standalone);
const manifest={appVersion:'1.6.0',releaseLabel:'1.60',engineVersion:'0.4.4',constantsVersion:'0.3.0',schemaVersion:'0.8.2',sessionSchemaVersion:'1.0.0',buildFingerprint:fingerprint,htmlSha256:crypto.createHash('sha256').update(hosted).digest('hex'),standaloneSha256:crypto.createHash('sha256').update(standalone).digest('hex'),sourceDeployment:'https://ethanol-caffeine-pk-pd-sandbox.pages.dev/'};
fs.writeFileSync(path.join(output,'build.json'),JSON.stringify(manifest,null,2)+'\n');
for(const n of files('src/assets')){const dest=path.join(output,n.slice('src/assets/'.length));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,n),dest);}
fs.writeFileSync(path.join(output,'sw.js'),read('src/sw.js').replaceAll('__CACHE_VERSION__',fingerprint.slice(0,20)));
fs.writeFileSync(path.join(output,'manifest.webmanifest'),JSON.stringify({id:'/',name:'Ethanol + Caffeine PK/PD Sandbox',short_name:'PK/PD Sandbox',description:'Local exposure sessions, model inspection and reproducible analysis.',start_url:'./#session/timeline',scope:'./',display:'standalone',background_color:'#f4f6fa',theme_color:'#216b61',icons:[{src:'./icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'./icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'./icons/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]},null,2)+'\n');
fs.writeFileSync(path.join(output,'_headers'),read('src/headers.txt'));
console.log(JSON.stringify({appVersion:'1.6.0',bytes:Buffer.byteLength(hosted),fingerprint,output},null,2));
