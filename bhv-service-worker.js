'use strict';

// the name of the cache
const CACHE_NAME = 'bhv-infoapp-k5a2b4an';

// all the files
const FILES_TO_CACHE = [
  '/404.html',
  '/imageview.html',
  '/',
  '/index.html',
  '/ov.html',
  '/players.html',
  '/presence.html',
  '/results.html',
  '/schedule.html',
  '/standings.html',
  '/styles.css',
  '/README.md',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/archive/19/kidsschedules.xml.gz',
  '/archive/19/results.xml.gz',
  '/archive/19/standings.xml.gz',
  '/calendar/calendar.html',
  '/calendar/controller.js',
  '/calendar/input.html',
  '/elements/expander/script.js',
  '/elements/expander/styles.css',
  '/favicons/android-chrome-192x192.png',
  '/favicons/android-chrome-512x512.png',
  '/favicons/apple-touch-icon-120x120-precomposed.png',
  '/favicons/apple-touch-icon-120x120.png',
  '/favicons/apple-touch-icon-152x152-precomposed.png',
  '/favicons/apple-touch-icon-152x152.png',
  '/favicons/apple-touch-icon-180x180-precomposed.png',
  '/favicons/apple-touch-icon-180x180.png',
  '/favicons/apple-touch-icon-60x60-precomposed.png',
  '/favicons/apple-touch-icon-60x60.png',
  '/favicons/apple-touch-icon-76x76-precomposed.png',
  '/favicons/apple-touch-icon-76x76.png',
  '/favicons/apple-touch-icon-precomposed.png',
  '/favicons/apple-touch-icon.png',
  '/favicons/browserconfig.xml',
  '/favicons/favicon-16x16.png',
  '/favicons/favicon-32x32.png',
  '/favicons/favicon.ico',
  '/favicons/mstile-144x144.png',
  '/favicons/mstile-150x150.png',
  '/favicons/mstile-310x150.png',
  '/favicons/mstile-310x310.png',
  '/favicons/mstile-70x70.png',
  '/favicons/safari-pinned-tab.svg',
  '/image/ball32.png',
  '/image/bhv1.gif',
  '/image/bhv2.gif',
  '/info/gesucht.html',
  '/info/gesucht.jpeg',
  '/info/info19.html',
  '/info/info20.html',
  '/info/u12.html',
  '/info/u13.html',
  '/info/u14.html',
  '/info/u15.html',
  '/info/u16.html',
  '/info/u18.html',
  '/info/u20.html',
  '/info/wunschzettel.html',
  '/script/animator.js',
  '/script/base64.js',
  '/script/db.js',
  '/script/pako_inflate.min.js',
  '/script/players.js',
  '/script/polyfills.js',
  '/script/presence.js',
  '/script/request.js',
  '/script/results.js',
  '/script/schedule.js',
  '/script/standings.js',
  '/script/svgviewer.js',
  '/script/utils.js',
  '/system6/annahme/zudritt.html',
  '/system6/annahme/zudritt.png',
  '/system6/aufspiel/angriff_06.html',
  '/system6/aufspiel/angriff_2.html',
  '/system6/aufspiel/angriff_5v.html',
  '/system6/aufspiel/angriff06.png',
  '/system6/aufspiel/angriff2.png',
  '/system6/aufspiel/angriff5v.png',
  '/system6/aufspiel/images/set_0_hi.png',
  '/system6/aufspiel/images/set_0.png',
  '/system6/aufspiel/images/set_1_hi.png',
  '/system6/aufspiel/images/set_1.png',
  '/system6/aufspiel/images/set_2_hi.png',
  '/system6/aufspiel/images/set_2.png',
  '/system6/aufspiel/images/set_3_hi.png',
  '/system6/aufspiel/images/set_3.png',
  '/system6/aufspiel/images/set_4_hi.png',
  '/system6/aufspiel/images/set_4.png',
  '/system6/aufspiel/images/set_5a_hi.png',
  '/system6/aufspiel/images/set_5a.png',
  '/system6/aufspiel/images/set_5b_hi.png',
  '/system6/aufspiel/images/set_5b.png',
  '/system6/aufspiel/images/set_6_hi.png',
  '/system6/aufspiel/images/set_6.png',
  '/system6/aufspiel/images/set_7_hi.png',
  '/system6/aufspiel/images/set_7.png',
  '/system6/aufspiel/images/set_8_hi.png',
  '/system6/aufspiel/images/set_8.png',
  '/system6/aufspiel/',
  '/system6/aufspiel/index.html',
  '/system6/aufspiel/plan.png',
  '/system6/aufspiel/vorbereitung_1.html',
  '/system6/aufspiel/vorbereitung_2.html',
  '/system6/aufspiel/vorbereitung1.png',
  '/system6/aufspiel/vorbereitung2.png',
  '/system6/aufspiel/wann_1.html',
  '/system6/aufspiel/wann_2.html',
  '/system6/aufspiel/wann1.png',
  '/system6/aufspiel/wann2.png',
  '/system6/aufspiel/wo.html',
  '/system6/aufspiel/wo.png',
  '/system6/blockinfo/aktiv.gif',
  '/system6/blockinfo/bewegung.gif',
  '/system6/blockinfo/bewegung3.png',
  '/system6/blockinfo/bewegung4.png',
  '/system6/blockinfo/block.html',
  '/system6/blockinfo/block1.gif',
  '/system6/blockinfo/block2.gif',
  '/system6/blockinfo/grundstellung.gif',
  '/system6/blockinfo/grundstellung2.gif',
  '/system6/blockinfo/passiv.gif',
  '/system6/blockinfo/zur_mitte.gif',
  '/system6/',
  '/system6/index.html',
  '/system6/spielfeld/',
  '/system6/spielfeld/index.html',
  '/system6/spielfeld/positionen.png',
  '/system6/spielfeld/spielfeld.png',
  '/system6/verteidigung/basis_1.html',
  '/system6/verteidigung/basis_1b.html',
  '/system6/verteidigung/basis_2.html',
  '/system6/verteidigung/basis1.png',
  '/system6/verteidigung/basis1b.png',
  '/system6/verteidigung/basis2.png',
  '/system6/verteidigung/block_2.html',
  '/system6/verteidigung/block_3.html',
  '/system6/verteidigung/block_31.html',
  '/system6/verteidigung/block_33.html',
  '/system6/verteidigung/block_35.html',
  '/system6/verteidigung/block_4.html',
  '/system6/verteidigung/block2.png',
  '/system6/verteidigung/block3.png',
  '/system6/verteidigung/block31.png',
  '/system6/verteidigung/block33.png',
  '/system6/verteidigung/block35.png',
  '/system6/verteidigung/block4.png',
  '/system6/verteidigung/ohne_1.html',
  '/system6/verteidigung/ohne_2.html',
  '/system6/verteidigung/ohne1.png',
  '/system6/verteidigung/ohne2.png',
  '/u12/certificate.jpeg',
  '/u13/certificate.jpeg',
  '/statistics/19/br3.html',
  '/statistics/19/mpo.html',
  '/statistics/19/u12.html',
  '/statistics/19/u13.html',
  '/statistics/19/u13x.html',
  '/statistics/19/u15.html',
  '/statistics/19/u15AR.html',
  '/statistics/19/u15FD.html',
  '/statistics/19/u15pn.html',
  '/statistics/19/u17.html',
  '/teambuilding/br3_19/',
  '/teambuilding/br3_19/index.html',
  '/teambuilding/br3_19/item1_small.jpg',
  '/teambuilding/br3_19/item1.jpg',
  '/teambuilding/br3_19/item2a_small.jpg',
  '/teambuilding/br3_19/item2a.jpg',
  '/teambuilding/br3_19/item2b_small.jpg',
  '/teambuilding/br3_19/item2b.jpg',
  '/teambuilding/br3_19/item3_small.jpg',
  '/teambuilding/br3_19/item3.jpg'
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
