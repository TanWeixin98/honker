const body_parser = require('body-parser');
const uuidv4 = require('uuid/v4');

module.exports = {
    init : function(app){
        app.use(body_parser.urlencoded({extended: true}));
        app.use(body_parser.json());
    },

    verify : function(username, res){
        if(!username){
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
        var id = uuidv4();
        req['id'] = id;
        req['username'] = username;
        req['property'] = {"likes" : 0};
        req['retweeted'] = 0;
        req['timestamp'] = Math.round((new Date()).getTime() / 1000);
        return req;
    },

    // For the range 1 < limit < 200
    checkLimit: (limit) => {
        if(limit == null) return 50; // Default is 50
        if(isNaN(limit)){
            console.log('Tried to limit a query with a non number: ', limit);
            return null;
        }
        if(limit < 1 || limit > 200){
            console.log('Limit not in range:', limit);
            return null;
        }
        return limit;
    },

  search_item_check: function(req, login_username){
    var msg_json = {};

    var ts = req.timestamp;
    var limit = req.limit;
    var search_query = req.q;
    var search_user = req.username;
    var following = req.following;

    if(limit === undefined)
      limit = 25;
    
    if(ts === undefined)
      ts = Date.now();
    
    if(following === undefined)
      following = true;
    
    if(search_user !== undefined)
      msg_json['username'] = search_user
    
    if(search_query !== undefined && search_query != "")
      msg_json['query'] = search_query
    
    if(!Number.isFinite(ts) || !Number.isInteger(limit))
      return {"status":"error" , "error":"Either ts or limit is not type int."};
    else if(limit < 1 || limit > 100)
      return {"status":"error", "error":"limit is either less than 1 or greater than 100."}
    
    if(login_username != null){
      if(following)
        msg_json["login_username"] = login_username;
    }
    
    msg_json['timestamp'] = ts;
    msg_json['limit'] = limit;
    return msg_json;
  }
}
