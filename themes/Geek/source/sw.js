/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'blog:static'

const HOST = self.location.host

const urlList = [
  '/',
  '/k.svg',
  '/index.html',
  '/img/avatar.jpg',
  '/css/style.css',
  '/highlight/styles/atom-one-dark.min.css',
  '/highlight/highlight.min.js',
  '/font/css/font-awesome.min.css'
]

self.addEventListener('install', event => {
  const init = async () => {
    console.info('service worker install success.')
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(urlList)
  }
  event.waitUntil(init())
})

self.addEventListener('activate', event => {
  const cleanCache = async () => {
    console.info('service worker activate success.')
    const keys = await caches.keys()
    var all = keys.map(key => {
      if (key.indexOf(CACHE_NAME) !== -1) {
        console.log('[SW]: Delete cache:' + key)
        return caches.delete(key)
      }
      return ''
    })
    return await Promise.all(all)
  }
  event.waitUntil(
    cleanCache()
  )
})

self.addEventListener('fetch', event => {
  const host = new URL(event.request.url).host
  if (host === HOST) {
    event.respondWith(
      caches.match(event.request)
        .then(async mat => {
          if (mat) return mat
          const request = event.request
          const res = await fetch(request)
          const response = res.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response)
          })
          return res
        })
    )
  } else {
    event.respondWith(
      fetch(event.request)
    )
  }
})