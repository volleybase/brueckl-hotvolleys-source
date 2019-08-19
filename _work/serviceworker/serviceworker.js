'use strict';

// the name of the cache
const CACHE_NAME = 'bhv-infoapp-{{key}}';

// all the files
const FILES_TO_CACHE = [
  {{FILES_TO_CACHE}}
];

self.addEventListener('install', (evt) => {
  console.log('[sw] install');

  // init cache with main files
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[cache-' + CACHE_NAME + '] create');
         return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
  console.log('[sw] activate');

  // remove old cache data
  evt.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => {
        if (name !== CACHE_NAME) {
          console.log('[cache-' + name +'] remove');
          return caches.delete(name);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[sw] fetch', evt.request.url);

  // fetch a ressource
  evt.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.match(evt.request, { 'ignoreSearch': true })
          .then((response) => {
            console.log(' -->', (response ? 'found' : 'not found'), evt.request.url);
            return response || fetch(evt.request);
          });
      })
  );
});
