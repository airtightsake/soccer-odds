const CACHE_NAME = 'soccer-odds-v5';
const urlsToCache = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - network-first for the page, cache-first for static assets,
// let API calls go straight to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip API and external requests entirely — don't intercept them
  if (
    url.hostname.includes('api.allorigins.win') ||
    url.hostname.includes('api.the-odds-api.com') ||
    url.hostname.includes('cors') ||
    event.request.method !== 'GET'
  ) {
    return; // Let the browser handle it normally
  }

  // Network-first for the page itself so deployed updates show up
  // immediately; fall back to cache only when offline
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For static assets (icons, fonts): cache-first with network fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(error => {
        console.log('SW fetch failed:', error);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
