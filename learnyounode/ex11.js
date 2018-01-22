var fs = require('fs')
var http = require('http')

var server = http.createServer((req, res) => {
    fs.createReadStream(process.argv[3]).pipe(res)
})

server.listen(parseInt(process.argv[2]))