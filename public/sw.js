/**
 * LJT Paysage - Service Worker
 * Cache-first strategy for static assets, network-first for HTML
 */

const CACHE_VERSION = 'ljt-paysage-v1';
const CACHE_ASSETS = `${CACHE_VERSION}-assets`;
const CACHE_PAGES = `${CACHE_VERSION}-pages`;

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_ASSETS)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheName.startsWith(CACHE_VERSION)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Don't cache non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Cache-first strategy for static assets
    if (isAsset(request.url)) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }

                    return fetch(request)
                        .then((response) => {
                            if (!response || response.status !== 200 || response.type === 'error') {
                                return response;
                            }

                            const responseToCache = response.clone();
                            caches.open(CACHE_ASSETS)
                                .then((cache) => cache.put(request, responseToCache));

                            return response;
                        })
                        .catch(() => {
                            // Return offline page if available
                            return caches.match('/index.html');
                        });
                })
        );
    }

    // Network-first strategy for HTML pages
    else {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_PAGES)
                        .then((cache) => cache.put(request, responseToCache));

                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then((response) => {
                            return response || caches.match('/index.html');
                        });
                })
        );
    }
});

/**
 * Determine if a URL is for a static asset
 */
function isAsset(url) {
    return /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|otf|ico)(\?.*)?$/.test(url);
}

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
