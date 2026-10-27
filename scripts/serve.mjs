import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public');
const types={'.html':'text/html; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'};
export function createServer(directory=root){return http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(name.endsWith('/'))name+='index.html';const file=path.resolve(directory,'.'+name);
 if(!file.startsWith(path.resolve(directory)+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(file,(error,content)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-cache'});res.end(content);});
 });}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||8765);createServer().listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));}
