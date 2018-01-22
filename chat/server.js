const express = require('express')
const app = express()
const SSE = require('express-sse');
const sse = new SSE()


app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/addComment', (req, res) => {
    chatLog.push(req.query.comment)
    res.send(chatLog)
    sse.send(chatLog)
})

app.get('/update', sse.init)

app.get('/getLog', (req, res) => {
   res.send(chatLog)
})

var chatLog = []

// var listener = app.listen(process.env.PORT, () => {)
const listener = app.listen(8000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})