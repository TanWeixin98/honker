const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 25,
    host: 'localhost',
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {

    sendVerification: function(email, verificationKey) {
        var mailOptions = {
            from: 'Honker@cse356.cloud.compas.cs.stonybrook.edu',
            to: email,
            subject: 'Verify your new Honker account.',
            text: 'validation key: <' + verificationKey + '>' + '\nhttp://honker.cse356.compas.cs.stonybrook.edu/verify'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) 
                console.error('Error sending mail to ' + email + '\n' + error);
            else
                console.log('Email sent to ' + email + '\n' + info.response);
        });
    }
}
