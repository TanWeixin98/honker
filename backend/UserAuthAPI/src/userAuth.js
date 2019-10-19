let  dbUtils = require( './dbUtils' );
const db = dbUtils.getDB().collection('users');

module.exports = {

    addUser: (req, res) => {
        if(req.body.email == null || req.body.displayName == null){
            res.json({ msg: 'An email and display name are required for registration.' });
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
                    console.log(req.body + ' ' + msg);
                    res.json( {status: 'error', error: msg });
                    return;
                }
                else{
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
                            console.log('Inserted new user: ' + user);
                            res.json({ status: 'OK' });
                        });
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
