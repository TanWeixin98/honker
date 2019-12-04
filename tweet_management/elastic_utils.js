const elasticsearch = require('@elastic/elasticsearch');

const client = new elasticsearch.Client({
        node : "http://localhost:9200",
        log: 'error'
});


module.exports = {

  text_search : function(options, callback){
    var q = {
        query:{
          bool: {
            must : []
          }
       	}
    }
    if(options.rank !== undefined) {
       q['sort'] =  [{[options.rank] : {"order": "desc"}}];
    }
    if(options.query !== undefined){
    	q['query']['bool']['must'].push({match:{content:options.query}});
    }

    if(options.username !== undefined){
    	q['query']['bool']['must'].push({match:{username:
							{ 'query': options.username,
							  'minimum_should_match' : options.username.length }}});
    }
    if(options.timestamp !== undefined){
        q['query']['bool']['filter'] = [({range :{timestamp:{lte: options.timestamp }}})];     
    }
    
    client.search({
        index: "tweet",
        body: q,
        size: options.limit,
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
