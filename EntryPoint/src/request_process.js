const body_parser = require('body-parser');
const random_key = require('random-key');

module.exports = {
  init : function(app){
    app.use(body_parser.urlencoded({extended: true}));
    app.use(body_parser.json());
  },

  add_item_check: function(req){
    var content = req.content;
    var childType = req.childType;
    var validType = ["retweet", "reply"];
    if(childType != null && validType.indexOf(childType) == -1){
      return {"status":"error", "error":"Invalid childType"};
    }else if(content === undefined){
      return {"status": "error", "error":"No content"};
    }
    var id = random_key.generate(10);
    req['id'] = id;
    return req;
  },

  search_item_check: function(req, method){
    if(method =="get"){
    
    }else{
    
    }
  }
}
