var amqp = require('amqplib');
var EventEmitter = require('events');
var uuidv4 = require('uuid/v4');

const REPLY_QUEUE = 'amq.rabbitmq.reply-to';
const RABBITMQ_URL = 'amqp://localhost';
var _channel;

module.exports = {

    sendRPCMessage :  (message, endpoint, RPC_QUEUE) => {
        return new Promise((resolve) => {
            const correlationId = uuidv4();
            // listen for the content emitted on the correlationId event
            _channel.responseEmitter.once(correlationId, resolve);
            _channel.sendToQueue(RPC_QUEUE, new Buffer.from(message), 
                { 
                    correlationId, 
                    replyTo: REPLY_QUEUE,
                    type: endpoint // Use this to specify which endpoint so the service can figure out which function to call
                })
        });
    },

    createClient: () => {
        amqp.connect(RABBITMQ_URL)
            .then((conn) => conn.createChannel())
            .then((channel) => {
                // create an event emitter where rpc responses will be published by correlationId
                channel.responseEmitter = new EventEmitter();
                channel.responseEmitter.setMaxListeners(0);
                channel.consume(REPLY_QUEUE,
                    (msg) => {
                        channel.responseEmitter.emit(msg.properties.correlationId, JSON.parse(msg.content));
                        console.log('Received', msg.content.toString());
                    },
                    {noAck: true});

                _channel =  channel;
            });
    }

}
