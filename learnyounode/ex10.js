var net = require('net')

function addZero(num) {return (num < 10 ? '0' : '') + num}

var server = net.createServer(socket => {
    var date = new Date()
    var year = date.getFullYear()
    var month = addZero(date.getMonth() + 1)
    var day = addZero(date.getDate())
    var hour = addZero(date.getHours())
    var min = addZero(date.getMinutes())
    socket.write(`${year}-${month}-${day} ${hour}:${min}\n`)
    socket.end()
})

server.listen(process.argv[2])