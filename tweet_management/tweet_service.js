const amqp = require('amqplib/callback_api');

const Logger = require('./utils/logger.js');
const mongodb = require('./utils/mongodb.js');
const utils = require('./tweet_utils.js');

const mongo_ip = "130.245.168.214";
const amqp_url = "amqp://localhost";
const mongo_url = "mongodb://" + mongo_ip + "/tweet";


var logger = new Logger("tweet_micro.log");

mongodb.start_connection(mongo_url, "tweet", function(db_err){
    if(db_err){
        logger.error("Failed to connect mongodb.", db_err);
        return;
    }
    logger.info("Connected to mongodb");
    mongodb.index('tweet', {username : "text", content: "text"}, function(index_err){
        if(index_err){
            logger.error("Failed to index username and content for tweets");
            return;
        }
    });
});

amqp.connect(amqp_url, function(connection_err, connection){
    if(connection_err){
        logger.error("Failed to connect rabbitmq.", connection_err);
        return;
    }
    logger.info("Connected to rabbitmq");

    connection.createChannel(function(channel_err, channel){
        if(channel_err){ 
            logger.error("Failed to create channel",channel_err);
            return;
        } 
        logger.info("Created channel...");

        var exchange = 'tweet';
        channel.assertExchange(exchange, 'direct', {durable: false});

        //add item
        channel.assertQueue('add_item', {durable: false}, function(add_err, add_queue){
            if(add_err){
                logger.error("Assert add queue failed. ", add_err);
                return;
            }
            logger.info("Assert add queue success");

            channel.bindQueue(add_queue.queue, exchange ,'add_tweet');
            channel.consume(add_queue.queue,function(msg){
                var payload_str = msg.content.toString();
                var payload = JSON.parse(payload_str);
                add_item(payload, function(err){
                    var res = {};
                    if(err){
                        logger.error("Failed to add: " + payload_str ,err);
                        res = {"status" : "error", "error":"failed to add tweet."};
                    }else{
                        logger.info("Item added: " + payload_str);
                        res = {"status" : "OK", "id" : payload.id};
                        if(payload.childType == "retweet"){
                          update_retweet_number(payload.parent, function(err){
                            if(err) logger("Failed to update retweet number");
                          })
                        }
                    }

                    res = JSON.stringify(res);
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(res), {correlationId: msg.properties.correlationId});
                    channel.ack(msg);
                }) 
            });
        });

        //remove 
        channel.assertQueue('delete_item', {durable: false}, function(remove_err, remove_queue){
            if(remove_err){
                logger.error("Assert search queue failed. ", remove_err);
                return;
            }
            logger.info("Assert remove item queue success");

            channel.bindQueue(remove_queue.queue, exchange, 'remove_tweet');
            channel.consume(remove_queue.queue, function(msg){
                var payload_str = msg.content.toString();
                var payload = JSON.parse(payload_str);
                del_item(payload, function(err, media){
                    var res = {};
                    if(err){
                        logger.error("Failed to remove" + payload_str, err );
                        res = {"status": "error", "error":"failed to remove tweet"};
                    }else{
                        logger.info("Item removed: " + payload_str);
                        res = {"status" :"OK", "media" : media};
                    }

                    res = JSON.stringify(res);
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(res), {correlationId: msg.properties.correlationId});
                    channel.ack(msg);
                });
            });
        });

        //like 
        channel.assertQueue('like_item', {durable: false}, function(like_err, like_queue){
            if(like_err){
                logger.error("Assert like queue failed.", like_err)
                return;
            }
            logger.info("Assert like queue success");

            channel.bindQueue(like_queue.queue, exchange, 'like_tweet');
            channel.consume(like_queue.queue, function(msg){
                var payload_str = msg.content.toString();
                var payload = JSON.parse(payload_str);
                like_item(payload, function(err){
                    var res = {};
                    if(err){
                        logger.error("Failed to like" + payload_str, err);
                        res = {"status" : "error", "error" : "failed to like tweet " + payload.id };
                    }else{
                        logger.info("Item liked: " + payload_str);
                        res = {"status" : "OK"};
                    }
               
                    res = JSON.stringify(res);
                    channel.sendToQueue(msg.properties.replyTo, Buffer.from(res), {correlationId : msg.properties.correlationId});
                    channel.ack(msg);
                });
            });
        });

        //search
        channel.assertQueue('search_item', {durable: false}, function(search_err, search_queue){
            if(search_err){
                logger.error("Assert search queue failed. ", search_err);
                return;
            }
            logger.info("Assert search queue success");

            channel.bindQueue(search_queue.queue, exchange, 'search_tweet');
            channel.consume(search_queue.queue, function(msg){
                var payload_str = msg.content.toString();
                var payload = JSON.parse(payload_str);

                var limit = payload.limit;
                payload.limit = 0;
                
                if(payload.rank == 'interest')
                  var sort_rule = {'interest': -1};
                else
                  var sort_rule = {'timestamp': -1}
                console.log(sort_rule)
                search_item(payload.id, {"timestamp" : payload.timestamp, 
                    "username": payload.username,
                    "limit" : payload.limit, 
                    "projections": {},
                    "query" : payload.query,
                    "sort_rule": sort_rule}, 
                    function(err, result){
                        var res = {};
                        if(err){
                            logger.error("Failed to search for: " + payload_str, err);
                            res = {"status":"error", "error":"failed to search tweet"};
                        }
                        else{
                            logger.info("Item search: " + payload_str 
                                + " RESULT:" + result);
                            res = {status : "OK"}

                            if(payload.getIDOnly !== undefined){
                                res['items'] = []
                                result.forEach(function(element){
                                    res['items'].push(element.id);
                                });
                            }
                            else if(Array.isArray(result)){
                                var items = utils.filter_tweets(result, 
                                                                payload.following_list, 
                                                                payload.replies, 
                                                                payload.parent_id, 
                                                                payload.has_media,
                                                                limit);  
                                res['items'] = items;
                            }
                            else res['item'] = result;
                        }

                        res = JSON.stringify(res);
                        channel.sendToQueue(msg.properties.replyTo, Buffer.from(res), {correlationId: msg.properties.correlationId});
                        channel.ack(msg)
                    });
            });
        });
    });
});

function add_item(payload, callback){
    mongodb.add("tweet", payload, function(err){
        if(err) return callback(err);
        return callback(null);
    });
}

function del_item(payload, callback){
    mongodb.search("tweet", payload, {_id: 0, media:1}, 1, {}, function(err, media){
        mongodb.remove("tweet", payload, function(del_err, obj){
            if(del_err) return callback(del_err, null) 
            if(obj.result.n != 1) return callback(new Error("cannot delete others post"), null);
            return callback(null, media[0].media);
        });
    });
}

function search_item(id, options, callback){
    if(id === undefined){
        var query = {timestamp: {$lte: options.timestamp}};
        if(options.username !== undefined) query['username'] = options.username;
        if(options.query !== undefined){
            query['$text'] = {$search: options.query};
        }
        mongodb.search("tweet", query, options.projections ,options.limit, options.sort_rule,function(err, result){
            if(err && err.message == "No matches") return callback(null, []);
            if(err) return callback(err, null);
            return callback(null, result);
        });
    }else{
        var query = {id: id};
        mongodb.search("tweet", query, options.projections, 1 , {_id: 0, interest: 0}, function(err, result){
            if(err) return callback(err, null);
            return callback(null, result[0]);
        });
    }
}

function update_retweet_number(parent_id, callback){
    var query = {id : parent_id};
    var update_query = {$inc : {retweeted: 1, interest: 1}};
    
    mongodb.update("tweet", query, update_query, function(err, result){
        if(err) return callback(err);
        else return callback(null);
    });
}

function like_item(payload, callback){
    var query = {id : payload.id};
    var projections = {_id : 0, like_list : 1, property : 1, interest : 1};
    var username = payload.username;


    mongodb.search("tweet", query, projections, 1, {}, function(err, result){
      if(err) return callack(err);

      var likes = result[0].property.likes;
      var like_list = result[0].like_list;
      var interest = result[0].interest;
      var index = like_list.indexOf(username);
      
      if(payload.like){
        if(index >= 0){
          return callback(new Error("User Already Liked"));
        }
        likes += 1;
        interest += 1;
        like_list.push(username);
      }else{
        if(index < 0){
          return callback(new Error("User have no liked yet"));
        }
        likes -= 1;
        interest -= 1;
        like_list.splice(index, 1);
      }
      
      var update_query = {$set: {property: {likes: likes},
                                like_list : like_list,
                                interest : interest}};
      logger.info(payload.id + " liked: "+ payload.like + ". Current likes: " + likes + " current like list" + like_list);      
      mongodb.update("tweet", query, update_query,function(err, result){
        if(err) return callback(err);
        else return callback(null);
      });
    })
}
