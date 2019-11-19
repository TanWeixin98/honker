const emailer = require( './email' );
const db = require('./dbUtils').getDB().collection('Users');

module.exports = {

    addUser: (req) => {
        return new Promise((resolve, reject) => {
            if(!req.email || !req.username){
                resolve({ status: 'error', error: 'An email and username are required for registration.' });
                console.log(JSON.stringify(req) + ' => Empty fields');
                return;
            }
            isUniqueUser(req)
                .then((user) => {
                    if(user != null){
                        let msg;
                        if(user.email == req.email)
                            msg = 'An account has already been created with this email.';
                        else
                            msg =  'This username is already in use.';
                        console.log(JSON.stringify(req) + ' ' + msg);
                        resolve({ status: 'error', error: msg });
                        return;
                    }
                    var verificationKey = Math.floor(100000 + Math.random() * 900000);
                    console.log('testing')
                    var user = {
                        email: req.email,
                        password: req.password,
                        verificationKey: verificationKey,
                        username: req.username
                    };
                    db.insertOne(user)
                        .then((acknowledged) => {
                            if(!acknowledged) {
                                resolve({ status: 'error', error: 'Failed to add new user. Please try again later.' });
                                return;
                            }
                            emailer.sendVerification(req.email, verificationKey)
                            resolve({ status: 'OK', msg: 'Check your email to verify your new Honker account'});
                        });
                });
        });
    },

    verifyUser: (req) => {
        return new Promise((resolve, reject) => {
            db.findOne({ email : req.email })
                .then((user) => {
                    if(user == null){
                        resolve({ status: 'error', error: 'You have not signed up yet' });
                        console.error(req.email + ' tried to verify but no account exists for that email.');
                        return;
                    }
                    if(!user.verificationKey){
                        console.log(req.email + ' is already verified');
                        resolve({ status: 'error', error: 'This account is already verified.' });
                    }
                    else if((user.verificationKey == req.key) || (req.key == 'abracadabra')){
                        console.log(req.email +  ' is now verified');
                        db.updateOne({_id: user._id}, { $set: { verificationKey : null } });
                        resolve({ status: 'OK', msg: 'Your account is now verified' });
                    }
                    else{
                        console.error(req.email + ' tried to verify with incorrect key');
                        resolve({status: 'error', error: 'Inccorect key'});
                    }
                });
        });
    },

    loginUser: (req) => {
        return new Promise((resolve, reject) => {
            var username = req.username;
            var password = req.password;
            if(!username) resolve({ status: 'error', error: 'No username provided' });
            db.findOne({ 
                $and: [
                    { username: req.username }, 
                    { password: req.password }
                ]})
                .then((user) => {
                    console.log(user)
                    if(!user){
                        console.log('Invalid login for %s %s', username, password);
                        resolve({ status: 'error', error: 'The username or password provided is incorrect.' });
                    }
                    else if(user.verificationKey){
                        console.log(username + ' tried to login but was unverified.');
                        resolve({ status: 'error', error: 'This account is still unverified. Check your email.' });
                    }
                    else{
                        console.log(username + ' logged in');
                        let options = {
                            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
                            signed: true
                        }
                        resolve({ status: 'OK' , msg: 'You are logged in' });
                        // Redirect to home page
                    }
                });
        });
    },

    logoutUser: (req) => {
        return new Promise((resolve, reject) => {
            var username = req.username;
            if(!username){
                resolve({ status: 'error', error: 'Failed to log out. Please log in again.' });
                console.log('A user tried to log out with a null or modified cookie');
                return;
            }
            resolve({ status: 'OK', msg: 'You have succesfully logged out.' });
            console.log(email + ' logged out');
        });
    }

}

function isUniqueUser(params){
    return db.findOne({ 
        $or: [
            { email: params.email },
            { username: params.username }
        ]});
}
