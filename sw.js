// The build stamps CACHE with a hash of the app files, so every deploy with
// changed assets installs a fresh service worker automatically.
const CACHE = 'sudoku-static-dev';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './sudoku.js', './cat.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  // Responses come from the network first, so it is safe to take over right away.
  self.skipWaiting?.();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('sudoku-static-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
// Network first (revalidating with the server so files are never stale),
// refreshing the offline copy; fall back to the cache only when offline.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(url.href, { cache: 'no-cache' });
      if (response.ok && cache.put) cache.put(event.request.mode === 'navigate' ? './index.html' : url.href, response.clone());
      return response;
    } catch {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      throw new Error('Offline and not cached');
    }
  })());
});
