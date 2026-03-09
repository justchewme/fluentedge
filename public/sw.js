// FluentEdge Service Worker
const CACHE = 'fluentedge-v1'

// Assets to pre-cache on install
const PRECACHE = [
  '/',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Skip API routes — always network
  if (url.pathname.startsWith('/api/')) return

  // Cache-first for Next.js static assets and fonts
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icon') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          const clone = response.clone()
          caches.open(CACHE).then(cache => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // Network-first for pages (with offline fallback to cached home)
  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE).then(cache => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match('/')))
  )
})
