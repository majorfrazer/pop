const CACHE = 'pd76';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
