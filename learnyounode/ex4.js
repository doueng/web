var fs = require('fs')
var buff = fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (!err)
        console.log(data.split('\n').length - 1)
})