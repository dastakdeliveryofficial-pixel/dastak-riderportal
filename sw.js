const CACHE_NAME = 'dastak-v5';
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['./', './index.html'])));
    self.skipWaiting();
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
    self.clients.claim();
});
self.addEventListener('fetch', e => {
    if (e.request.url.includes('firebaseio.com') || e.request.url.includes('googleapis.com') || e.request.url.includes('gstatic.com')) return;
    if (e.request.url.includes('cdn.') || e.request.url.includes('cdnjs.cloudflare.com')) {
        e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cl = res.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, cl)); return res; })));
        return;
    }
    e.respondWith(fetch(e.request).then(res => { const cl = res.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, cl)); return res; }).catch(() => caches.match(e.request)));
});
