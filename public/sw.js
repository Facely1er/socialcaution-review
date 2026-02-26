// Service Worker for SocialCaution - Production Ready with Enhanced Offline Support
// Using vanilla service worker API for better compatibility

const CACHE_VERSION = 'v2.1.2';
const OFFLINE_CACHE = 'socialcaution-offline-v2.1.2';
const DATA_CACHE = 'socialcaution-data-v2.1.2';
const IMAGE_CACHE = 'socialcaution-images-v2.1.2';
const STATIC_CACHE = 'socialcaution-static-v2.1.2';

// Service Worker activation with cache cleanup
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then((cache) => {
      // Pre-cache critical offline resources
      return cache.addAll([
        '/',
        '/offline.html',
        '/manifest.json',
        '/socialcaution.png'
      ]).catch((err) => {
        // Silently fail - not critical for service worker to work
        console.log('Cache pre-caching failed:', err);
      });
    })
  );
});

// Service Worker activation with cache cleanup and client notification
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !name.includes(CACHE_VERSION))
            .map((name) => {
              return caches.delete(name);
            })
        );
      }),
      // Notify all clients about update
      clients.matchAll().then((clientList) => {
        clientList.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      })
    ])
  );
});

// Cache strategy for different resource types using vanilla service worker API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip external API requests (external APIs) - let them pass through
  // This prevents the service worker from interfering with external API requests
  if (url.hostname === 'api.stripe.com' ||
      url.hostname === 'js.stripe.com' ||
      url.hostname.includes('google-analytics.com') ||
      url.hostname.includes('googletagmanager.com')) {
    return; // Let the browser handle these requests directly
  }

  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          // Return a placeholder if fetch fails
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open('api-cache').then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Handle CSS and JS with stale-while-revalidate
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(OFFLINE_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/offline.html').then((offlinePage) => {
            return offlinePage || new Response('Offline', { status: 503 });
          });
        });
      })
    );
    return;
  }

  // Default: network-first for other requests
  event.respondWith(
    fetch(request).then((response) => {
      // Only cache successful responses
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(DATA_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(request).then((cachedResponse) => {
        // Always return a Response object, never undefined
        return cachedResponse || new Response('Not available offline', { 
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

// Background sync for analytics when offline
// Note: Offline analytics sync is disabled until backend API is implemented
// To enable: implement getOfflineAnalytics, sendAnalyticsEvent, and clearOfflineAnalytics functions
/*
self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  try {
    // Sync offline analytics when connection is restored
    const offlineAnalytics = await getOfflineAnalytics();
    if (offlineAnalytics && offlineAnalytics.length > 0) {
      for (const event of offlineAnalytics) {
        await sendAnalyticsEvent(event);
      }
      await clearOfflineAnalytics();
    }
  } catch (error) {
    // Silently fail - analytics sync is not critical
    console.error('Analytics sync failed:', error);
  }
}
*/

// Cache management and update notifications
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open('dynamic-cache').then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  }
});
