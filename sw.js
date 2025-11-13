// Bump the version number when you deploy a new service worker
const CACHE_NAME = 'jvp-spark-v1.0.0.dev.282';
const urlsToCache = [
  '/jvp-spark/',
  '/jvp-spark/index.html',
  '/jvp-spark/css/style.css',
  '/jvp-spark/css/offline-overlay.css',
  '/jvp-spark/css/install-popup-styles.css',
  '/jvp-spark/css/qr-scan.css',
  '/jvp-spark/css/dialog.css',
  '/jvp-spark/css/word-card-styles.css',
  '/jvp-spark/js/main.js',
  '/jvp-spark/js/dialog.js',
  '/jvp-spark/js/offline-manager.js',
  '/jvp-spark/js/pwa-utils.js',
  '/jvp-spark/js/qr-scan.js',
  '/jvp-spark/js/supabase-crud.js',
  '/jvp-spark/js/word-card.js',
  '/jvp-spark/pages/result/index.html',
  '/jvp-spark/pages/syllabus/index.html',
  '/jvp-spark/pages/blueprint/index.html',
  '/jvp-spark/favicon-16x16.png',
  '/jvp-spark/favicon-32x32.png',
  '/jvp-spark/android-chrome-192x192.png',
  '/jvp-spark/android-chrome-512x512.png',
  '/jvp-spark/apple-touch-icon.png',
  '/jvp-spark/favicon.ico',
  // External resources that need to be cached
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js',
  'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'
];

// --- EVENT LISTENERS ---

// Install event: precache all essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache. Caching files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});

// Fetch event: intercept network requests and apply caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests. Ignore all others (like POST, PUT, DELETE, etc.)
  // and let the browser handle them normally.
  if (request.method !== 'GET') {
    return;
  }

  // Apply Network First for top-level navigations AND iframe documents.
  // This ensures both the main page and its embedded pages are always fresh when online.
  if (request.mode === 'navigate' || request.destination === 'iframe' || request.destination === 'document') {
    // A specific fallback is only needed for the main page navigation.
    const fallbackUrl = (request.mode === 'navigate') ? '/jvp-spark/index.html' : undefined;
    event.respondWith(networkFirst(request, fallbackUrl));
    return;
  }

  // For all other assets (CSS, JS, images, fonts), use Cache First for speed.
  event.respondWith(cacheFirst(request));
});


// --- CACHING STRATEGIES ---

/**
 * Cache First Strategy:
 * 1. Try to get the response from the cache.
 * 2. If it's in the cache, return it.
 * 3. If not, fetch from the network, cache the response, and then return it.
 */
async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResp = await fetch(req);
    // Check if we received a valid response
    if (networkResp && networkResp.ok) {
      const cache = await caches.open(CACHE_NAME);
      // IMPORTANT: Clone the response before caching it.
      await cache.put(req, networkResp.clone());
    }
    return networkResp;
  } catch (error) {
    console.error('Fetch failed in cacheFirst strategy:', error);
    throw error;
  }
}

/**
 * Network First Strategy:
 * 1. Try to fetch from the network.
 * 2. If successful, cache the response and return it.
 * 3. If the network fails (e.g., offline), return the response from the cache.
 * 4. Provide a fallback URL for navigation requests if everything fails.
 */
async function networkFirst(req, fallbackUrl) {
  try {
    const networkResp = await fetch(req);
    if (networkResp.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(req, networkResp.clone());
      return networkResp;
    }
    // If fetch gives a server error (e.g. 404), try the cache instead.
    const cachedResponse = await caches.match(req);
    return cachedResponse || networkResp;
  } catch (error) {
    console.log('Network fetch failed. Trying cache...');
    const cached = await caches.match(req);
    if (cached) {
      return cached;
    }
    if (fallbackUrl) {
      return caches.match(fallbackUrl);
    }
    throw error;
  }
}


// --- OTHER SERVICE WORKER FUNCTIONALITY ---

self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

self.addEventListener('push', event => {
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'JVP Spark',
      body: event.data.text(),
      data: { notificationID: 'default' }
    };
  }

  const options = {
    body: data.body || 'New update available!',
    icon: '/jvp-spark/android-chrome-192x192.png',
    badge: '/jvp-spark/favicon-32x32.png',
    vibrate: [200, 100, 200],
    data: data.data
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'JVP Spark', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const notificationID = event.notification.data ?
    event.notification.data.notificationID :
    null;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/jvp-spark/') && 'focus' in client) {
          client.focus();
          if (notificationID) {
            client.postMessage({ type: 'NOTIFICATION_CLICK', id: notificationID });
          }
          return;
        }
      }
      if (clients.openWindow) {
        const urlToOpen = notificationID ?
          `/jvp-spark/index.html?notification_id=${notificationID}` :
          '/jvp-spark/index.html';
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('controllerchange', () => {
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    clientList.forEach(client => client.navigate(client.url));
  });
});

function doBackgroundSync() {
  return Promise.resolve();
}
