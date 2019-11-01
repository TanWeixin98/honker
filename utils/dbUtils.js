const MongoClient = require('mongodb').MongoClient;

var _db;

module.exports = {

    connectToServer: (url, database, callback) => {
        MongoClient.connect(
            url,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true 
            },
            (err, db) => {
                _db = db.db(database);
                return callback(err)
            }
        );
    },

    getDB: () => {return _db}

};
