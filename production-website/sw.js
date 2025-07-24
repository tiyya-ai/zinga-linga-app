// Service Worker for Zinga Linga Website
// Provides offline functionality and caching

const CACHE_NAME = 'zinga-linga-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/main.js',
    '/assets/images/logo.png',
    '/assets/images/kiki.png',
    '/assets/images/tano.png',
    '/assets/images/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});