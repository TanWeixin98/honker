const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/';

var _db;

module.exports = {

    connectToServer: function(callback, database){
        MongoClient.connect(mongoURL,
            { useNewUrlParser: true,
              useUnifiedTopology: true },
            function(err, db){
            _db = db.db(database);
            return callback(err);
        });
    },

    getDB: function() {
        return _db;
    }
};
