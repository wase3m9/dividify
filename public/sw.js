/* Simple service worker to cache static assets and uploads for repeat visits
   This improves Lighthouse "Use efficient cache lifetimes" without changing UX. */

const ASSET_CACHE = 'dividify-assets-v1';

self.addEventListener('install', (event) => {
  // Activate immediately after installation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== ASSET_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests for our own origin
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  const isVersionedAsset = url.pathname.startsWith('/assets/');
  const isUpload = url.pathname.startsWith('/lovable-uploads/');

  if (isVersionedAsset || isUpload) {
    // Cache-first strategy with background update
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(req, { ignoreVary: true });
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => cached);

        // Return cached immediately if available, else network
        return cached || fetchPromise;
      })()
    );
  }
});
