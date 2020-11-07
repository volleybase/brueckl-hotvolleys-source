"use strict";

// the names and the files of the cache
const CACHE = {
  {{keys}}
};
const FILES = {
  {{files}}
};

self.addEventListener('install', (evt) => {
  console.log('[sw] install');

  // init cache with files
  const parts = Object.keys(CACHE);
  evt.waitUntil(
    parts.forEach((part) => {
      caches.open(CACHE[part])
        .then((cache) => {
          console.log('create cache: ' + part + ' - '+ CACHE[part]);
          return cache.addAll(FILES[part]);
        });
    })
  );

  self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
  console.log('[sw] activate');

  // remove old cache data
  const valid_names = Object.values(CACHE);
  evt.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => {
        if (valid_names.indexOf(name) == -1) {
          console.log('remove cache ' + name);
          return caches.delete(name);
        }
      }));
    })
  );

  self.clients.claim();
});


self.addEventListener('fetch', (evt) => {
  console.log('[sw] fetch', evt.request.url);

  // get right cache
  // link to dir with index.html is fetched without trailing /, then with trailing /
  let nameCache = CACHE['main'];
  if (evt.request.url.indexOf('/data/') > -1) {
    nameCache = CACHE['data'];
  } else if (evt.request.url.indexOf('/system1') > -1) {
    nameCache = CACHE['system1'];
  } else if (evt.request.url.indexOf('/system4') > -1) {
    nameCache = CACHE['system4'];
  } else if (evt.request.url.indexOf('/system6') > -1) {
    nameCache = CACHE['system6'];
  } else if (evt.request.url.indexOf('/favicons/') > -1) {
    nameCache = CACHE['favicons'];
  } else if (evt.request.url.indexOf('/info/') > -1) {
    nameCache = CACHE['info'];
  } else if (evt.request.url.indexOf('/statistics/19/') > -1) {
    nameCache = CACHE['statistics_19'];
  } else if (evt.request.url.indexOf('/teambuilding/br3_19') > -1) {
    nameCache = CACHE['teambuilding_19'];
  } else if (evt.request.url.indexOf('/teambuilding/herzhirn_21') > -1) {
    nameCache = CACHE['teambuilding_21'];
  } else if (evt.request.url.indexOf('/videofeedback') > -1) {
    nameCache = CACHE['videofeedback'];
  }

  // fetch a ressource
  evt.respondWith(
    caches.open(nameCache)
      .then((cache) => {
        return cache.match(evt.request, { 'ignoreSearch': true })
          .then((response) => {
            console.log(' -->', (response ? 'found' : 'not found') + ' in ' + nameCache, evt.request.url);
            return response || fetch(evt.request);
          });
      })
  );
});


self.addEventListener('message', messageEvent => {
  // start the waiting for new serviceworker
  if (messageEvent.data === 'skipWaiting') {
    console.log('[sw] start waiting for service worker');
    return skipWaiting();
  }
});
