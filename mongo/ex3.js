var mongo = require('mongodb').MongoClient
var src = 'mongodb://localhost:27017/learnyoumongo'
var age = process.argv[2]

mongo.connect(src, (err, db) => {
    if (err) throw err
    var coll = db.db('learnyoumongo').collection('parrots')
    coll.find({
        age: {$gt: parseInt(age)}
    }).toArray((err, documents) => {
        if (err) throw err
        console.log(documents)
    })
    db.close()
})
