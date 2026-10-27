const CACHE='pkpd-v15-baf471dede356f4b33ed';
const PREFIX='pkpd-v15-';
const ASSETS=['./index.html','./standalone-v1.5.0.html','./build.json','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})));})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys(),old=keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE);for(const key of old.slice(0,Math.max(0,old.length-1)))await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='PKPD_ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'&&['./','./index.html','./standalone-v1.5.0.html'].some(asset=>new URL(asset,self.location.href).pathname===url.pathname))event.respondWith((async()=>{const cache=await caches.open(CACHE),key=url.pathname.endsWith('standalone-v1.5.0.html')?'./standalone-v1.5.0.html':'./index.html';return (await cache.match(key))??fetch(req);})());
 else if(ASSETS.some(asset=>new URL(asset,self.location.href).pathname===url.pathname))event.respondWith((async()=>{const cache=await caches.open(CACHE),found=await cache.match(req,{ignoreSearch:true});return found??fetch(req);})());
});
