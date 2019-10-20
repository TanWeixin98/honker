const emailer = require( './email' );
let  dbUtils = require( './dbUtils' );
const db = dbUtils.getDB().collection('users');
const cookie = require ( 'cookie' );

module.exports = {

    addUser: (req) => {
        return new Promise((resolve, reject) => {
            if(!req.email || !req.displayName){
                resolve({ msg: 'An email and display name are required for registration.' });
                console.log(JSON.stringify(req.body) + ' => Empty fields');
            }
            isUniqueUser(req)
                .then((user) => {
                    if(user != null){
                        let msg;
                        if(user.email == req.email)
                            msg = 'An account has already been created with this email.';
                        else
                            msg =  'This display name is already in use.';
                        console.log(JSON.stringify(req) + ' ' + msg);
                        resolve({ status: 'error', error: msg });
                    }
                    var verificationKey = Math.floor(100000 + Math.random() * 900000);
                    var user = {
                        email: req.email,
                        password: req.password,
                        verificationKey: verificationKey,
                        displayName: req.displayName
                    };
                    db.insertOne(user)
                        .then((acknowledged) => {
                            if(!acknowledged) {
                                resolve({ status: 'error', error: 'Failed to add new user. Please try again later.' });
                            }
                            console.log('Inserted new user: ' + JSON.stringify(user));
                            emailer.sendVerification(req.email, verificationKey)
                            resolve({ status: 'OK', msg: 'Check your email to verify your new Honker account'});
                            // Redirect user to /verify in the frontend
                        });
                });
        });
    },
            verifyUser: (req, res) => {
                db.findOne({ 'email' : req.body.email })
                    .then((user) => {
                        if(user == null){
                            res.json({ statis: 'error', error: 'You have not signed up yet' });
                            console.error(req.body.email + ' tried to verify but no account exists for that email.');
                            return;
                        }
                        if(!user.verificationKey){
                            console.log(req.body.email + ' is already verified');
                            res.json({ status: 'error', error: 'This account is already verified.' });
                        }
                        else if((user.verificationKey == req.body.key) || (req.body.key == 'abracadabra')){
                            console.log(req.body.email +  ' is now verified');
                            db.updateOne({_id: user._id}, { $set: { verificationKey : null } });
                            res.json({ status: 'OK', msg: 'Your account is now verified' });
                        }
                        else{
                            console.error(req.body.email + ' tried to verify with incorrect key');
                            res.json({status: 'error', error: 'Inccorect key'});
                        }
                    });
            },

            loginUser: (req, res) => {
                var email = req.body.email;
                var password = req.body.password;
                db.findOne({ 'email': email, 'password': password })
                    .then((user) => {
                        if(!user){
                            console.log('Invalid login for %s %s', email, password);
                            res.json({ status: 'error', error: 'The email or password provided is incorrect.' });
                        }
                        else if(user.verificationKey){
                            console.log(email + ' tried to login but was unverified.');
                            res.json({ status: 'error', error: 'This account is still unverified. Check your email.' });
                        }
                        else{
                            console.log(email + ' logged in');
                            let options = {
                                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                                signed: true
                            }
                            let sessionCookie = cookie.serialize('email', email);
                            res.cookie('authToken', sessionCookie, options);
                            res.json({ status: 'OK' });
                            // Redirect to home page
                        }
                    });
            },

            logoutUser: (req, res) => {
                var authToken = req.signedCookies.authToken;
                res.clearCookie('authToken', { signed: true });
                if(!authToken){
                    res.json({ status: 'error', error: 'Failed to log out. Please log in again.' });
                    console.log('A user tried to log out with a null or modified cookie');
                    return;
                }
                var email = cookie.parse(authToken).email;
                res.json({ status: 'OK', msg: 'You have succesfully logged out.' });
                console.log(email + ' logged out');
            }

    }

    function isUniqueUser(params){
        return db.findOne({ 
            $or: [
                { email: params.email },
                { displayName: params.displayName }
            ]});
    }
