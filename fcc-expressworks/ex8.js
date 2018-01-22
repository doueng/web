var fs = require('fs')
var express = require('express')
var app = express()

app.get('/books', (req, res) => {
    fs.readFile(process.argv[3], 'utf8', (err, data) => {
        if (err)
            return res.send(404)
        res.json(JSON.parse(data))
    })
})

app.listen(process.argv[2])