var cookieParser = require('cookie-parser');
var path = require('path');

console.log('Listening on port 8080');

var userAuth;
var dbUtils = require( './dbUtils' );
dbUtils.connectToServer((err, client) => {
    if(err) console.log(err);
    else{
        userAuth = require('./userAuth');
    }
});

const amqp = require('amqplib');
const RABBITMQ = 'amqp://localhost'

const open = amqp.connect(RABBITMQ);
const q = 'UserAuth';

open
    .then((conn) => {
        console.log(`[ ${new Date()} ] Server started`);
        return conn.createChannel();
    })
    .then((channel) => {
        return channel.assertQueue(q).then((ok) => {
            return channel.consume(q, (msg) => {
                if (msg !== null) {
                    var parsedMsg = JSON.parse(msg.content.toString('utf8'));
                    console.log('Pulled new message: ', parsedMsg);

                    var func;
                    switch(msg.properties.type){
                        case 'addUser':
                            func = userAuth.addUser(parsedMsg);
                            break;
                        case 'verify':
                            func = userAuth.verifyUser(parsedMsg);
                            break;
                        case 'login':
                            func = userAuth.loginUser(parsedMsg);
                            break;
                        case 'logout':
                            func = userAuth.logoutUser(parsedMsg);
                            break;
                        default:
                            console.log('Unknown request type: ', msg.properties.type);
                            channel.ack(msg);
                    }

                    if(func) {
                        func.then((response) => {
                            var respString = JSON.stringify(response);
                            console.log('Message sent: ', respString);

                            channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(respString),
                                {
                                    correlationId: msg.properties.correlationId,
                                }
                            );
                            channel.ack(msg);
                        })
                    }
                }
            });
        });
    })
    .catch(console.warn);
