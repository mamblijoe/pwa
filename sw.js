const CACHE_NAME = 'pwa-cache-v1'
const urlsToCache = ['index.html', 'offline.html']

const getCachesUrl = async () => {
    const cache = await caches.open(CACHE_NAME)
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
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, safeResponse)
            })
        }

        return safeResponse.clone()
    } catch {
        return caches.match('offline.html')
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
