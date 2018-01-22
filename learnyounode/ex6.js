var mod = require('./ex5.js')
mod(process.argv[2], process.argv[3], (err, data) => {
    if (err)
        console.error('Error', err)
    else
        data.forEach(file => {
            console.log(file)
        })
})