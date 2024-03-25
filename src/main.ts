const CACHE_NAME = 'pwa-cache-v1'
const urlsToCache = ['index.html', 'offline.html']

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then((_reg) =>
                console.log(
                    `%c >>> ${new Date().toTimeString()}: Сервик-воркер зарегистрирован`,
                    'color: green'
                )
            )
            .catch((err) =>
                console.log(
                    `%c >>> ${new Date().toTimeString()}:Error: ${err}`,
                    'color: red'
                )
            )
    })
}

const getElement = (item: {
    userId: string
    id: string
    title: string
    body: string
}) => {
    const { userId, id, title, body } = item
    return `<div style="border: 1px solid black; border-radius: 5px; padding: 5px; margin: 10px 0; background: #F3F3F3">
                <div>User Id:${userId}</div>
                <div>Post Id:${id}</div>
                <div>Title:${title}</div>
                <div>Body:${body}</div>
            </div>`
}

const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const items = await response.json()
    const list = []

    for (const item of items) {
        list.push(getElement(item))
    }

    document.querySelector('.list')!.innerHTML = list.join('')
}

await fetchPosts()

//

const deleteButton = document.querySelector('#delete')
const addOneButton = document.querySelector('#add-one')
const addManyButton = document.querySelector('#add-many')

const deleteCache = async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.delete('offline.html')
}

const addOneCache = async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.add('offline.html')
}

const addManyCache = async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(urlsToCache)
}

deleteButton!.addEventListener('click', deleteCache)
addOneButton!.addEventListener('click', addOneCache)
addManyButton!.addEventListener('click', addManyCache)

export {}
