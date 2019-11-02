const mongo = require('mongodb');

module.exports = {

   start_connection : function(url,name, callback){
   mongo.MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology:true},
                    function(err, database){
                    if(err) return callback(err);
                    
                    //TODO log success
                    mongodb = database.db(name);
                    return callback(null);
                    }); 
  },

  add : function(collection_name, object, callback){
    mongodb.collection(collection_name).insertOne(object, function(err, result){
      if(err) return callback(err);
      
      //TODO log success
      return callback(null);
    });
  },

  remove : function(collection_name, query, callback){
    mongodb.collection(collection_name).deleteOne(query, function(err, result{
      if(err) return callback(err, null);
      return callback(null, result);
    }));
  },

  search : function(collection_name, query, projections, max=1,sort_rule={}, callback){
    mongodb.collection(collection_name).find(query, {projection:projections}).sort(sort_rule).limit(max).toArray(function(err, result){
      if(err) return callback(err, null);
      if(result.length==0) return callback(new Error("No matches"), null);
      else return callback(null, result);
    });
  }
}
