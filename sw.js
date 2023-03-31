self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  self.skipWaiting(); //PENTING bila ada versi baru!!
  event.waitUntil(
    caches.open('cachePWA')
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/app.js',
          '/blog.html',
          '/about.html',
          '/style.css',
          '/contact.html'
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== 'cachePWA' && key !== 'cachePWA') {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('cachePWA')
      .then(function(cache) {
        return fetch(event.request)
          .then(function(res) {
            cache.put(event.request, res.clone());
            return res;
          });
      })
  );
});
