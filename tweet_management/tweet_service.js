const amqp = require('amqplib/callback_api');

const Logger = require('./utils/logger.js');
const mongodb = require('./utils/mongodb.js');

const mongo_ip = "localhost";
const amqp_url = "amqp://localhost";
const mongo_url = "mongodb://" + mongo_ip + "/tweet";

var logger = new Logger("tweet_micro.log");

mongodb.start_connection(mongo_url, "tweet", function(db_err){
  if(db_err){
    logger.error("Failed to connect mongodb.", db_err);
    return;
  }
  logger.info("Connected to mongodb");
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
    channel.assertQueue('add_item', {exclusive: true, durable: false}, function(add_err, add_queue){
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
          }
         
          res = JSON.stringify(res);
          channel.sendToQueue(msg.properties.replyTo, Buffer.from(res), {correlationId: msg.properties.correlationId});
          channel.ack(msg);
        }) 
      });
    });

    //search
    channel.assertQueue('search_item', {exclusive: true, durable: false}, function(search_err, search_queue){
      if(search_err){
        logger.error("Assert search queue failed. ", search_err);
        return;
      }
      logger.info("Assert search queue success");

      channel.bindQueue(search_queue.queue, exchange, 'search_tweet');
      channel.consume(search_queue.queue, function(msg){
        var payload_str = msg.content.toString();
        var payload = JSON.parse(payload_str);

        search_item(payload.id, {"timestamp" : payload.timestamp, "username": payload.username,"limit" : payload.limit, "projections": {}}, function(err, result){
          var res = {};
          if(err){
            logger.error("Failed to search for: " + payload_str, err);
            res = {"status":"error", "error":"failed to search tweet"};
          }else{
            logger.info("Item search: " + payload_str 
                        + " RESULT:" + result);
            res = {"status" : "OK"}
            if(Array.isArray(result)) res['items'] = result;
            else res['item'] = result;
          }
          
          res = JSON.stringify(res);
          console.log(res);
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

function del_item(){}

function search_item(id, options, callback){
  if(id === undefined){
    var query = {timestamp: {$lte: options.timestamp}};
    if(options.username !== undefined) query['username'] = options.username
    console.log(options.projections)
    mongodb.search("tweet", query, options.projections ,options.limit, {'timestamp': -1},function(err, result){
      if(err && err.message == "No matches") return callback(null, []);
      if(err) return callback(err, null);
      return callback(null, result);
    });
  }else{
    var query = {'id': id};
    mongodb.search("tweet", query, options.projections, 1 , {}, function(err, result){
      if(err) return callback(err, null);
      return callback(null, result[0]);
    });
  }
}
