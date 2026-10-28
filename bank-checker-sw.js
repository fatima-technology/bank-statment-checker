/* Bank Checker: app ko install hone layak banata hai aur internet na ho to bhi khulta hai */
const C='bank-checker-v3';
const HOME=new URL('./',self.registration.scope).href;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.webmanifest','./bank-checker-192.png','./bank-checker-512.png']).catch(()=>{})))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  /* app ka page kholte waqt: agar file na mile (404) ya internet na ho, to hamesha app ka asal page dikhao */
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(HOME,cp));return res}
      return fetch(HOME).then(h=>h.ok?h:caches.match(HOME)).catch(()=>caches.match(HOME)).then(h=>h||res)})
      .catch(()=>caches.match(HOME)));return}
  e.respondWith(fetch(r).then(res=>{if(res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true})));
});
