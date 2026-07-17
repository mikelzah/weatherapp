const CACHE_NAME = 'weather-app-v1';
const CORE_ASSETS = ['/', '/index.html', '/app.js', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isWeatherApi = req.url.includes('api.open-meteo.com')
    || req.url.includes('geocoding-api.open-meteo.com')
    || req.url.includes('bigdatacloud.net');

  if (isWeatherApi) {
    // Сеть в приоритете (свежие данные), при офлайне — последний закэшированный ответ.
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Статика приложения: сначала кэш, чтобы приложение открывалось мгновенно и офлайн.
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
      return res;
    }))
  );
});
