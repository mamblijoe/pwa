const STATIC_CACHE_NAME = 'static-pwa-cache-v1'
const DYNAMIC_CACHE_NAME = 'dynamic-pwa-cache-v1'
const urlsToCache = ['index.html', 'offline.html']

const getCachesUrl = async () => {
    const cache = await caches.open(STATIC_CACHE_NAME)
    return await cache.addAll(urlsToCache)
}

const fetchServing = async (event) => {
    try {
        const response = await caches.match(event)
        let safeResponse = response

        if (response === undefined) {
            safeResponse = await fetch(event.request)
        }

        if (
            event.request.url === 'https://jsonplaceholder.typicode.com/posts'
        ) {
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(event.request.url, safeResponse)
            })
        }

        return safeResponse
    } catch {
        if (event.request.url.includes('.html')) {
            return caches.match('offline.html')
        }
    }
}

this.addEventListener('install', (event) => {
    const cachesUrl = event.waitUntil(getCachesUrl())
})

this.addEventListener('fetch', (event) => {
    event.respondWith(fetchServing(event))
})

this.addEventListener('activate', (event) => {
    const cacheWhitelist = []
    cacheWhitelist.push(DYNAMIC_CACHE_NAME)
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
