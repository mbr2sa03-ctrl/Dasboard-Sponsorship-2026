// MBR2 Sponsorship Management — service worker
// Strategy: cache the app shell (this HTML page + manifest + icons) so the app
// can be installed and opened offline. All other requests (Firebase, CDN
// libraries, fonts) go network-first with a cache fallback, since that data
// needs to stay fresh whenever the device is online.

const CACHE_NAME = 'mbr2-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests; let everything else (POST to Firebase etc.) pass through.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isShellFile = url.origin === self.location.origin &&
    SHELL_FILES.some((f) => url.pathname.endsWith(f.replace('./', '')) || url.pathname === '/' );

  if (isShellFile) {
    // Cache-first for the app shell itself, so it opens instantly and works offline.
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  // Network-first for everything else (CDN scripts, fonts, Firebase reads),
  // falling back to cache if the network is unavailable.
  event.respondWith(
    fetch(req)
      .then((res) => {
        // Opportunistically cache successful CDN/library responses for offline reuse.
        if (res && res.status === 200 && (url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('gstatic.com') || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com'))) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
