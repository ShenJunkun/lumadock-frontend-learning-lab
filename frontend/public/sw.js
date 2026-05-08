/* global caches, fetch, self, URL */

const CACHE_NAME = "lumadock-shell-v1";
const SHELL_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/lumadock-hero-640.webp",
  "/assets/lumadock-hero-960.webp",
  "/assets/lumadock-hero-1280.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET" || new URL(request.url).pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
});
