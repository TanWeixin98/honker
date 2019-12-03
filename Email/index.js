const amqp = require('amqplib');
const RABBITMQ = 'amqp://35.245.241.197'
const open = amqp.connect(RABBITMQ)
const q = 'Emailer';

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 25,
    host: 'localhost',
    tls: {
        rejectUnauthorized: false
    }
});
console.log('start')
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

                    sendVerification(parsedMsg.email, parsedMsg.verificationKey)
                    channel.ack(msg)
                }
            });
        });
    })
    .catch(console.warn);

function sendVerification(email, verificationKey) {
    var mailOptions = {
        from: 'Honker@cse356.cloud.compas.cs.stonybrook.edu',
        to: email,
        subject: 'Verify your new Honker account.',
        text: 'validation key: <' + verificationKey + '>' + '\nhttp://honker.cse356.compas.cs.stonybrook.edu/verify'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.error('Error sending mail to ' + email + '\n' + error);
        }
        else{
            console.log('Email sent to ' + email + '\n' + info.response);
        }
    });
}
