const CACHE_NAME = "rizqi-pwa-v1";
const urlsToCache = [
  "/",                // Penting agar root juga dicache
  "/index.html",
  "/about.html",
  "/css/main.css",
  "/js/main.js"
];

// Install event — caching all essential files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[Service Worker] Caching all resources");
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event — optional cleanup for old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch event — try cache first, then network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached version
        }
        return fetch(event.request) // Fallback to network
          .catch(() => {
            // Optionally return a fallback page here for offline
            if (event.request.mode === 'navigate') {
              return caches.match("/index.html");
            }
          });
      })
  );
});


// const CACHE_NAME = "rizqi-pwa-v1";
// const urlsToCache = [
//   "index.html",
//   "about.html",
//   "css/main.css",
//   "js/main.js"
// ];

// self.addEventListener("install", event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener("fetch", event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => response || fetch(event.request))
//   );
// });
