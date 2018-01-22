var express = require('express')
var app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

// var listener = app.listen(process.env.PORT, () => {)
var listener = app.listen(8000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})