import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public');
const types={'.html':'text/html; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'};
export function createServer(directory=root,{htmlRedirects=false}={}){return http.createServer((req,res)=>{
 let url,name;try{url=new URL(req.url,'http://localhost');name=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
 if(htmlRedirects&&name.endsWith('.html')){
  const target=name.endsWith('/index.html')?name.slice(0,-10):name.slice(0,-5);
  res.writeHead(308,{Location:target+url.search});res.end();return;
 }
 if(name.endsWith('/'))name+='index.html';let file=path.resolve(directory,'.'+name);
 if(!file.startsWith(path.resolve(directory)+path.sep)){res.writeHead(403);res.end();return;}
 if(htmlRedirects&&!path.extname(file)&&fs.existsSync(file+'.html'))file+='.html';
 fs.readFile(file,(error,content)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-cache'});res.end(content);});
 });}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||8765);createServer().listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));}
