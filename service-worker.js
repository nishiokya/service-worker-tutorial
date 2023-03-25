const CACHE_NAME = 'query-suggestions-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => console.log('Caching failed:', error))
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(error => console.log('Error:', error))
  );
});