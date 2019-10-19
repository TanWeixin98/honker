const amqp = require('amqplib/callback_api');

const Logger = require('./utils/logger.js');
//const mongodb = require('../utils/mongodb.js')

const amqp_url = "amqp://localhost"
const mongo_url = ""

var logger = new Logger("tweet_micro.log");

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
    channel.assertQueue('add_item', {exclusive: true}, function(add_err, add_queue){
      if(add_err){
        logger.error("Assert add queue failed. ", add_err);
        return;
      }
      channel.bindQueue(add_queue.queue, exchange ,'add_tweet');
      channel.consume(add_queue.queue,function(msg){
        console.log(msg);
      }, {noAck: true});
    });

    //search
    channel.assertQueue('search_item', {exclusive: true}, function(search_err, search_queue){
      if(search_err){
        logger.error("Assert search queue failed. ", search_err);
        return;
      }
      channel.bindQueue(search_queue.queue, exchange, 'search_tweet');
      channel.consume(search_queue.queue, function(msg){
        console.log(msg);
      },{noAck: true});
    });

  });
});

function add_item(user_name, content, childType){
  //mongodb.add();
}

function del_item(){}

function search_item(id, options){
  if(id === undefined){
    
  }
}
