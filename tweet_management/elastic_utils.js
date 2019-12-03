const elasticsearch = require('@elastic/elasticsearch');

const client = new elasticsearch.Client({
        node : "http://192.168.122.12:9200",
        log: 'error'
});


module.exports = {

  text_search : function(options, callback){
    let query = {
        "sort": [{
          [options.rank] : {"order": "asc"}
        }],
        query:{
          bool: {
            must : [
              {match: {
                content : options.query
              }}
            ],
            filter : [
              {range :{
                timestamp:{
                  lte: options.timestamp
                }
              }}
            ] 
          }
        }
      }
      client.search({
        index: "tweet",
        body: query,
        size: options.limit * 2,
      }, (err, result) =>{
        if(err) return callback(err, null);
        result = result.body.hits.hits;
        if(result.length == 0) return callback(new Error("No matches"), null)
        items =[]
        result.forEach((element) => {
          items.push(element._source);
        })
        return callback(null, items)
      });
  }

}

        //sort: "{ interest : {order : asc, ignore_unmapped: true}}",
