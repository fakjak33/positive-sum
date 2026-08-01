/*
 * Service worker for Positive Sum.
 *
 * Hand-written rather than generated. The site is fully static with no runtime
 * data fetching, so the caching story is simple enough that a build plugin
 * would add more moving parts than it removes — and this way the behaviour is
 * legible and under our control.
 *
 * Strategy:
 *   - Navigations: network first, falling back to cache, falling back to the
 *     offline page. Readers should get fresh content when online, and
 *     something useful when not.
 *   - Static assets (JS, CSS, fonts, images): cache first. They are
 *     content-hashed by Next, so a cached copy is never stale.
 */

const VERSION = "v1";
const PAGES = `ps-pages-${VERSION}`;
const ASSETS = `ps-assets-${VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE = ["/", "/analogies", "/play", OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES);
      // Precache individually so one 404 cannot fail the whole install.
      await Promise.allSettled(PRECACHE.map((url) => cache.add(url)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("ps-") && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the dev server's HMR endpoints.
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(PAGES);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })()
    );
    return;
  }

  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|png|svg|jpg|jpeg|webp|ico)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          if (fresh.ok) {
            const cache = await caches.open(ASSETS);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch {
          return new Response("", { status: 504 });
        }
      })()
    );
  }
});
