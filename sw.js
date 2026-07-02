/* ============================================================
   SERVICE WORKER — cache-first app shell (F8).
   Bump CACHE on every deploy so kids' iPads pick up new content.
   The game has zero network needs after first load.
============================================================ */
const CACHE='bcg-v4.2.0';
const SHELL=[
  './',
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'js/parts.js',
  'js/audio.js',
  'js/save.js',
  'js/speech.js',
  'js/fx.js',
  'js/surprises.js',
  'js/paint.js',
  'js/photo.js',
  'js/drive.js',
  'js/game.js',
  'fonts/luckiest-guy-latin.woff2',
  'fonts/nunito-latin-var.woff2',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(hit=>
      hit||fetch(e.request).then(res=>{
        // runtime-cache same-origin extras so airplane mode keeps working
        if(res.ok&&new URL(e.request.url).origin===location.origin){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy));
        }
        return res;
      }).catch(()=>caches.match('index.html'))
    )
  );
});
