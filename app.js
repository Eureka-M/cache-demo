const http = require('http')
const fs = require('fs')
const url = require('url')
const etag = require('etag')

http.createServer((req, res) => {
    console.log(req.method, req.url)

    const { pathname } = url.parse(req.url)
    if (pathname === '/') {
        const data = fs.readFileSync('./index.html')
        res.end(data)
    }
    else if (pathname === '/img/icon-01.png') {
        const data = fs.readFileSync('./img/icon-01.png')
        res.writeHead(200, {
            'Expires': new Date('2022-06-29 21:00:00').toUTCString()
        })
        res.end(data)
    }
    else if (pathname === '/img/icon-02.png') {
        const data = fs.readFileSync('./img/icon-02.png')
        res.writeHead(200, {
            'Cache-Control': 'max-age=10'
        })
        res.end(data)
    }
    else if (pathname === '/img/icon-03.png') {
        const { mtime } = fs.statSync('./img/icon-03.png')
        const ifModifiedSince = req.headers['if-modified-since']

        if (ifModifiedSince === mtime.toUTCString()) {
            res.statusCode = 304
            res.end()
            return
        }

        const data = fs.readFileSync('./img/icon-03.png')
        res.setHeader('last-modified', mtime.toUTCString())
        res.setHeader('Cache-Control', 'no-cache')
        res.end(data)
    }
    else if (pathname === '/img/icon-04.png') {
        const data = fs.readFileSync('./img/icon-04.png')
        const et = etag(data)
        const ifNoneMatch = req.headers['if-none-match']

        if (ifNoneMatch === et) {
            res.statusCode = 304
            res.end()
            return
        }

        res.setHeader('etag', et)
        res.setHeader('Cache-Control', 'no-cache')
        res.end(data)
    }
    else if (pathname === '/img/icon-05.png') {
        const data = fs.readFileSync('./img/icon-05.png')
        const { mtime } = fs.statSync('./img/icon-05.png')
        res.end(data)
    }
    else {
        res.statusCode = 404
        res.end()
    }
}).listen(3000, () => {
    console.log()
})