const CACHE='aism-studio-v3';
const CORE=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return res}).catch(()=>caches.match('./index.html')));
  return;
 }
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return res})));
});