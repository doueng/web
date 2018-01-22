var http = require('http')
var numDone = 0

var strs = {
    'one': '',
    'two': '',
    'three': '',
}

function httpget(url, whichStr) {
    http.get(url, (response) => {
        response.setEncoding('utf8')
        response.on('data', data => {
            strs[whichStr] += data
        })
        response.on('error', console.error)
        response.on('end', () => {
            if (++numDone === 3)
            {
                console.log(strs['one'])
                console.log(strs['two'])
                console.log(strs['three'])
            }
        })
    })
}

httpget(process.argv[2], 'one')
httpget(process.argv[3], 'two')
httpget(process.argv[4], 'three')