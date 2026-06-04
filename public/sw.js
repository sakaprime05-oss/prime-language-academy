const CACHE_NAME = "prime-academy-v6";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/logo.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-icon-512x512.png",
];

const PRIVATE_PATH_PREFIXES = [
  "/api/",
  "/auth/",
  "/dashboard",
  "/checkout",
  "/login",
  "/register",
  "/register-club",
  "/forgot-password",
  "/reset-password",
];

function shouldBypassCache(requestUrl) {
  const url = new URL(requestUrl);
  if (url.origin !== self.location.origin) return true;
  return PRIVATE_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
}

function canCacheResponse(response) {
  const cacheControl = response.headers.get("Cache-Control") || "";
  return response.status === 200 && !/no-store|private/i.test(cacheControl);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (shouldBypassCache(url.toString())) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (canCacheResponse(response)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
        }

        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
