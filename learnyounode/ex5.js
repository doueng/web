module.exports = (dirName, fileType, callback) => {
    var fs = require('fs')
    var end = "." + fileType
    fs.readdir(dirName, (err, list) => {
        if (err)
            callback(err)
        else
            callback(err, list.filter(file => {
                return file.slice(-1 * end.length) === end
            }))
    })
}
