const CACHE='pkpd-v15-__CACHE_VERSION__';
const PREFIX='pkpd-v15-';
const ASSETS=['./index.html','./standalone-v2.0.0.html','./build.json','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})));})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys(),old=keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE);for(const key of old.slice(0,Math.max(0,old.length-1)))await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='PKPD_ACTIVATE_UPDATE')self.skipWaiting();});
function cachedResponse(response){
 // Pages redirects HTML paths. Navigation requests cannot reuse a response
 // whose URL list still records that redirect; preserve its bytes and headers.
 return response?.redirected?new Response(response.body,{status:response.status,statusText:response.statusText,headers:response.headers}):response;
}
async function cacheOrNetwork(request,key){
 try{
  const cache=await caches.open(CACHE),found=await cache.match(key,{ignoreSearch:true});
  if(found)return cachedResponse(found);
 }catch{}
 return fetch(request);
}
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
 const standalone=['./standalone-v2.0.0.html','./standalone-v2.0.0'].some(asset=>new URL(asset,self.location.href).pathname===url.pathname);
 if(req.mode==='navigate'&&(standalone||['./','./index.html'].some(asset=>new URL(asset,self.location.href).pathname===url.pathname)))event.respondWith(cacheOrNetwork(req,standalone?'./standalone-v2.0.0.html':'./index.html'));
 else if(ASSETS.some(asset=>new URL(asset,self.location.href).pathname===url.pathname))event.respondWith(cacheOrNetwork(req,req));
});
