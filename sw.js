// Minimal service worker — makes Summit installable. Data lives in localStorage on-device.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
self.addEventListener("fetch", (e) => { e.respondWith(fetch(e.request)); });
