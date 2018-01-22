var fs = require('fs')
var buff = fs.readFileSync(process.argv[2])
console.log(buff.toString().split('\n').length - 1)