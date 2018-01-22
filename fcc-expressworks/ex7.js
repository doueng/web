var express = require('express')
var app = express()

app.get('/search', (req, res) => {
    res.send(req.query)
})

app.listen(process.argv[2])