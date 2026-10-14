// Версія кешу змінена (v2): під час активації старий кеш видаляється разом із застарілими копіями сторінок.
const C='syntax-builder-v2',F=['./','index.html','manifest.json','icon.svg'];
const MINE=F.map(f=>new URL(f,self.registration.scope).href);
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // Інші сторінки (online.html, teacher.html тощо) браузер завантажує напряму, без кешу цього застосунку.
  if(!MINE.includes(e.request.url.split('?')[0].split('#')[0]))return;
  // Спочатку мережа (завжди свіжа версія), кеш лише як запас, коли немає інтернету.
  e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return n})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
