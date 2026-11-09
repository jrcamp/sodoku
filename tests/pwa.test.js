import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, access } from 'node:fs/promises';
test('manifest icons exist and app launches within its relative standalone scope', async () => {
  const manifest = JSON.parse(await readFile('manifest.webmanifest', 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.start_url, './');
  for (const icon of manifest.icons) await access(icon.src);
});
test('service worker precaches existing assets and serves offline navigations under a repository subpath', async () => {
  const scope = 'https://example.github.io/sodoku/';
  const handlers = {}, stored = new Map();
  const cache = {
    async addAll(paths) { for (const path of paths) { await access(path === './' ? 'index.html' : path); stored.set(new URL(path, scope).href, { asset: path }); } },
    async match(request) { return stored.get(new URL(typeof request === 'string' ? request : request.url, scope).href); }
  };
  vm.runInNewContext(await readFile('sw.js', 'utf8'), {
    URL,
    self: { location: { origin: 'https://example.github.io' }, registration: { scope }, clients: { claim: async () => {} }, addEventListener: (type, handler) => { handlers[type] = handler; } },
    caches: { open: async () => cache, keys: async () => [], delete: async () => true },
    fetch: async () => { throw new Error('Offline'); }
  });
  let pending;
  handlers.install({ waitUntil: p => { pending = p; } }); await pending;
  handlers.activate({ waitUntil: p => { pending = p; } }); await pending;
  for (const path of ['styles.css', 'app.js', 'sudoku.js', 'icons/icon-192.png']) {
    handlers.fetch({ request: { url: scope + path, method: 'GET' }, respondWith: p => { pending = p; } });
    assert.equal((await pending).asset, './' + path);
  }
  handlers.fetch({ request: { url: scope + '?installed=1', method: 'GET', mode: 'navigate' }, respondWith: p => { pending = p; } });
  assert.equal((await pending).asset, './index.html');
  let intercepted = false;
  handlers.fetch({ request: { url: 'https://example.github.io/another-app/', method: 'GET' }, respondWith: () => { intercepted = true; } });
  assert.equal(intercepted, false);
});
