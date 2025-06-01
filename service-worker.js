const CACHE_NAME = 'egg-timer-cache-v1';
const urlsToCache = [
  './', // Caches the root URL, typically index.html
  './index.html',
  './alarm.wav',
  './manifest.json',
  './icons/icon-192x192.png', // Add all your icon paths
  './icons/icon-512x512.png',
  './icons/maskable_icon.png'
  // If you want full offline functionality for Tailwind CSS, you could try caching its CDN link,
  // but it's often more reliable for offline if you self-host Tailwind CSS or include its output directly.
  // 'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache during install');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Serve from cache if available
        }
        // If not in cache, try to fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Optional: Cache new requests on the fly
            // return caches.open(CACHE_NAME).then(cache => {
            //   cache.put(event.request, networkResponse.clone());
            //   return networkResponse;
            // });
            return networkResponse;
          })
          .catch(() => {
            // Fallback for offline if network fails and not in cache
            // You could serve an offline page here
            console.log('Fetch failed, no cache entry.');
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});