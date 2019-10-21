const body_parser = require('body-parser');
const random_key = require('random-key');

module.exports = {
  init : function(app){
    app.use(body_parser.urlencoded({extended: true}));
    app.use(body_parser.json());
  },

  verify : function(req, res, cookie){
    var authToken = req.cookies['authToken'];
    if(authToken == null || cookie.readAuthToken(authToken) == null){
      res.statusCode = 500;
      res.json({"status":"error", "error":"Not log in"});
      return false;
    }
    return true;
  },

  add_item_check: function(req, username){
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
    req['username'] = username;
    req['property'] = {"likes" : 0};
    req['retweeted'] = 0;
    req['timestamp'] = Date.now();
    return req;
  },

  search_item_check: function(req){
    var ts = req.timestamp;
    var limit = req.limit;
    if(limit === undefined){
      limit = 25;
    }
    if(ts === undefined){
      ts = Date.now();
    }
    if(!Number.isFinite(ts) || !Number.isInteger(limit)){
      return {"status":"error" , "error":"Either ts or limit is not type int."};
    }else if(limit < 1 || limit > 100){
      return {"status":"error", "error":"limit is either less than 1 or greater than 100."}
    }
    return {"timestamp":ts , "limit":limit};
  }
}
