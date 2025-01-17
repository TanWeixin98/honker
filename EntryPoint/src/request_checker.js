const body_parser = require('body-parser');
const uuidv4 = require('uuid/v4');

module.exports = {
    init : function(app){
        app.use(body_parser.urlencoded({extended: true}));
        app.use(body_parser.json());
    },

    verify : function(username, res){
        if(!username){
            res.statusCode = 401;
            res.json({"status":"error", "error":"Not log in"});
            return false;
        }
        return true;
    },

    add_item_check: function(req, username){
        var content = req.content;
        var tweet_parent = req.parent;
        var childType = req.childType;
        var validType = ["retweet", "reply"];
        var media = req.media;

        if(media === undefined){
            media =[];
        }
        if(childType === undefined)
            childType = null
        if(childType != null && validType.indexOf(childType) == -1){
            return {"status":"error", "error":"Invalid childType"};
        }else if(childType != null){
            if(tweet_parent === undefined)
                return {"status" : "error", "error" : "Reply or Retweeted Post Without Parent Id"};
            req['parent'] = tweet_parent;
        }
        if(content === undefined){
            return {"status": "error", "error":"No content"};
        }

        var id = uuidv4();
        req['id'] = id;
        req['media'] = media;
        req['username'] = username;
        req['property'] = {"likes" : 0};
        req['retweeted'] = 0;
        req['timestamp'] = Math.round((new Date()).getTime() / 1000);
        req['interest'] = 0;
        req['like_list'] = [];
        return req;
    },

    // For the range 1 < limit < 200
    checkLimit: (limit) => {
        if(limit == null) return 50; // Default is 50
        if(isNaN(limit)){
            console.log('Tried to limit a query with a non number: ', limit);
            return null;
        }
        else if(limit < 1){
            console.log('Limit not in range:', limit);
            return null;
        }
        else if(limit > 200){
            return 200;
        }
        return Number.parseInt(limit);
    },

  search_item_check: function(req, login_username){
    var msg_json = {};

    var ts = req.timestamp;
    var limit = req.limit;
    var search_query = req.q;
    var search_user = req.username;
    var following = req.following;
    var rank = req.rank;
    var parent_id = req.parent;
    var replies = req.replies;
    var hasMedia = req.hasMedia;

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

    if(rank === undefined)
      rank = "interest";
    
    if(replies === undefined)
      replies = true;
    
    if(replies){
      if(parent_id !== undefined)
        msg_json['parent_id'] = parent_id;
    }

    if(hasMedia === undefined)
      hasMedia = false

    if(rank != 'interest' && rank != 'time')
      return {"status":"error", "error":"Rank is not valid. It should be time or interest"};
    
    if(rank == 'time')
      rank = 'timestamp'

    if(!Number.isFinite(ts) || !Number.isInteger(limit))
      return {"status":"error" , "error":"Either ts or limit is not type int."};
    else if(limit < 1)
      limit = 25;
    else if(limit > 100)
      limit = 100;
    if(login_username != null){
      if(following)
        msg_json["login_username"] = login_username;
    }

    msg_json['rank'] = rank;
    msg_json['replies'] = replies;
    msg_json['timestamp'] = ts;
    msg_json['limit'] = limit;
    msg_json['has_media'] = hasMedia;
    return msg_json;
  }
}
