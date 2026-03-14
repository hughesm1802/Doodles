// Recipe Ebook — Service Worker
// Cache-first for static shell, network-first for pages/API

const CACHE = 'recipe-ebook-v1'

const PRECACHE = [
  '/',
  '/manifest.json',
  '/icon.svg',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // Skip cross-origin requests (fonts, instagram, youtube, etc.)
  if (url.origin !== self.location.origin) return

  // Network-first for navigation (HTML pages)
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(request, clone))
          return res
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/')))
    )
    return
  }

  // Cache-first for static assets (JS, CSS, images, fonts)
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(res => {
        if (!res || res.status !== 200) return res
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(request, clone))
        return res
      })
    })
  )
})
