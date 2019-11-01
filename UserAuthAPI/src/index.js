var userAuth;
require( './dbUtils' )
    .connectToServer(
        'mongodb://localhost:27017/',
        'UserAuth',
        (err) => {
            if(err) console.log(err);
            else
                userAuth = require('./userAuth')
        }
    );

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
                            func = userAuth.addUser;
                            break;
                        case 'verify':
                            func = userAuth.verifyUser;
                            break;
                        case 'login':
                            func = userAuth.loginUser;
                            break;
                        case 'logout':
                            func = userAuth.logoutUser;
                            break;
                        default:
                            console.log('Unknown request type: ', msg.properties.type);
                    }

                    if(func) {
                        func(parsedMsg).then((response) => {
                            var respString = JSON.stringify(response);
                            console.log('Message sent: ', respString);

                            channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(respString),
                                {
                                    correlationId: msg.properties.correlationId,
                                }
                            );
                        })
                    }

                    channel.ack(msg);
                }
            });
        });
    })
    .catch(console.warn);
