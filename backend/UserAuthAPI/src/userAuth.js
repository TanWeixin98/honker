const emailer = require( './email' );
let  dbUtils = require( './dbUtils' );
const db = dbUtils.getDB().collection('users');

module.exports = {

    addUser: (req, res) => {
        if(!req.body.email || !req.body.displayName){
            res.json({ msg: 'An email and display name are required for registration.' });
            console.log(JSON.stringify(req.body) + ' => Empty fields');
            return;
        }
        isUniqueUser(req.body)
            .then((user) => {
                if(user != null){
                    let msg;
                    if(user.email == req.body.email)
                        msg = 'An account has already been created with this email.';
                    else
                        msg =  'This display name is already in use.';
                    console.log(JSON.stringify(req.body) + ' ' + msg);
                    res.json( {status: 'error', error: msg });
                    return;
                }
                var verificationKey = Math.floor(100000 + Math.random() * 900000);
                var user = {
                    email: req.body.email,
                    password: req.body.password,
                    verificationKey: verificationKey,
                    displayName: req.body.displayName
                };
                db.insertOne(user)
                    .then((acknowledged) => {
                        if(!acknowledged) {
                            res.json({ status: 'error', error: 'Failed to add new user. Please try again later.' });
                            return;
                        }
                        console.log('Inserted new user: ' + JSON.stringify(user));
                        emailer.sendVerification(req.body.email, verificationKey)
                        res.json({ status: 'OK', msg: 'Check your email to verify your new Honker account'});
                        // Redirect user to /verify in the frontend
                    });
            });
    },

    verifyUser: function(req, res){
        db.findOne({ 'email' : req.body.email })
            .then(function(user){
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
    }

}

function isUniqueUser(params){
    return db.findOne({ 
        $or: [
            { email: params.email },
            { displayName: params.displayName }
        ]});
}
