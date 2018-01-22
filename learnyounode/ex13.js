var http = require('http')
var url = require('url')

var server = http.createServer((req, res) => {
    var o = url.parse(req.url, true)
    var iso = o.query.iso
    if (o.pathname === '/api/parsetime') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        var d = {
            "hour": parseInt(iso.slice(11, 13)) + 1,
            "minute": parseInt(iso.slice(14, 16)),
            "second": parseInt(iso.slice(17, 19)),
        }
        res.end(JSON.stringify(d))
    }
    else if (o.pathname === '/api/unixtime') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(JSON.stringify({"unixtime": new Date(iso).getTime()}))
    }
    else {
        res.writeHead(404)
        res.end()
    }
})

server.listen(Number(process.argv[2]))