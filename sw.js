const CACHE_NAME = 'soccer-odds-v3';
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

// Fetch event - only cache local assets, let API calls go straight to network
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

  // For local/app-shell assets: cache-first with network fallback + error handling
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return networkResponse;
        });
      })
      .catch(error => {
        console.log('SW fetch failed:', error);
        // Return a basic offline fallback if needed
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
