const CACHE='ff-v1';
const SHELL=['./','./index.html','./data.js','./manifest.json','./icon-192.png','./icon-512.png','https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// كاش أولاً، وأي ملف جديد (بما فيه ملفات القراءة من jsdelivr) يتخزن تلقائياً
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:false}).then(hit=>hit||fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return r}).catch(()=>caches.match('./index.html'))));
});
