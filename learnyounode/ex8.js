var allData = ''

var http = require('http')
http.get(process.argv[2], response => {
    response.setEncoding('utf8')
    response.on('data', (data) => {
        allData += data
    })
    response.on('error', console.error)
    response.on('end', () => {
        console.log(allData.length)
        console.log(allData)
    })
})
