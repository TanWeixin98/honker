const elasticsearch = require('@elastic/elasticsearch');

const client = new elasticsearch.Client({
        node : "http://192.168.122.12:9200",
        log: 'error'
});


module.exports = {

  text_search : function(search_text, callback){
      let query = {
        query :{
          match: {
                  content : {query : search_text}
          }
        }
      }
      client.search({
        index: "tweet",
        body: query,
        size: 9999
      }, (err, result) =>{
        result = result.body.hits.hits;
        if(err) return callback(err, null);
        if( result.length == 0) return callback(new Error("No matches"), null)
        items =[]
        result.forEach((element) => {
          items.push(element._source);
        })
        return callback(null, items)
      });
  }

}

