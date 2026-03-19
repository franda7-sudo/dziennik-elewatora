const CACHE_NAME = 'elewator-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Możesz dodać tu lokalną ikonę, jeśli ją pobrałeś:
  // './icon-512.png', 
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
];

// 1. Instalacja
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Używamy mapowania, aby błąd jednego pliku nie przerywał całości
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url))
      ).then(() => self.skipWaiting());
    })
  );
});

// 2. Aktywacja
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Strategia: Najpierw Cache, potem Sieć
self.addEventListener('fetch', (event) => {
  // Ignoruj zapytania do Firebase (one muszą iść przez sieć)
  if (event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});