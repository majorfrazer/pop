const CACHE='popdarts-v55';
const ASSETS=['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './darts/dart-black-green.webp', './darts/dart-tropical.webp', './darts/dart-black-blue.webp',
  './darts/dart-white-purple.webp', './darts/dart-cyan.webp', './darts/dart-white-teal.webp', './darts/dart-lime.webp'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('script.google.com') || e.request.url.includes('fonts.')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (!res || res.status !== 200) return res;
    const c = res.clone();
    caches.open(CACHE).then(cache => cache.put(e.request, c));
    return res;
  }).catch(() => e.request.headers.get('accept').includes('text/html') ? caches.match('./index.html') : null)));
});
