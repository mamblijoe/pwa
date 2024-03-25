const CACHE_NAME = 'pwa-cache-v1'
const urlsToCache = ['index.html', 'offline.html']

const getCachesUrl = async () => {
    const cache = await caches.open(CACHE_NAME)
    return await cache.addAll(urlsToCache)
}

const fetchServing = async (request) => {
    const match = await caches.match(request)
    try {
        return fetch(request)
    } catch (error) {
        return caches.match('offline.html')
    }
}

this.addEventListener('install', (event) => {
    const cachesUrl = event.waitUntil(getCachesUrl())
})

this.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            console.log('fetch', event)
            return fetch(event.request).catch(() => {
                console.log('ERROR', caches.match('offline.html'))
                return caches.match('offline.html')
            })
        })
    )
})

this.addEventListener('activate', (event) => {
    const cacheWhitelist = []
    cacheWhitelist.push(CACHE_NAME)
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName)
                    }
                })
            )
        )
    )
})
