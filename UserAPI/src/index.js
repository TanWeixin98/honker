var users;

require( './dbUtils' )
    .connectToServer(
        'mongodb://localhost:27017/',
        'Users',
        (err) => {
            if(err) console.log(err);
            else
                users = require('./users');
        });

const amqp = require('amqplib');
const RABBITMQ = 'amqp://localhost'

const open = amqp.connect(RABBITMQ);
const q = 'UserAPI';

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
                        case 'addUser': // To add a user that just signed up into the this database
                            func = users.addUser;
                            break;
                        case 'followUser':
                            break;
                        case 'getUser':
                            break;
                        case 'getUserPosts':
                            break;
                        case 'getUserFollowers':
                            break;
                        case 'getUserFollowings':
                            break;
                        default:
                            console.log('Unknown request type: ', msg.properties.type);
                            channel.ack(msg);
                    }

                    if(func) {
                        func(parsedMsg)
                            .then((response) => {
                                var respString = JSON.stringify(response);
                                console.log('Message sent: ', respString);

                                channel.sendToQueue(
                                    msg.properties.replyTo,
                                    Buffer.from(respString),
                                    {
                                        correlationId: msg.properties.correlationId,
                                    }
                                );
                                if(!response.internalError)
                                    channel.ack(msg);
                            })
                    }

                }
            });
        });
    })
    .catch(console.warn);
