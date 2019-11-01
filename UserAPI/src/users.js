const db = require('./dbUtils').getDB().collection('Users');

module.exports = {

    addUser: (req) => {
        return new Promise((resolve, reject) => {
            if(!req.username){
                resolve({ status: 'error', error: 'A username is required for registration.' });
                console.log(JSON.stringify(req) + ' => Empty fields');
                return;
            }
            db.findOne({ username: req.username })
                .then((user) => {
                    if(user != null){
                        var msg = 'An account has already been created with this username.';
                        console.log(JSON.stringify(req) + ' ' + msg);
                        resolve({ status: 'InternalError', error: msg });
                        return;
                    }
                    var user = {
                        email: req.email,
                        username: req.username,
                        followerCount: 0,
                        followingCount: 0,
                        followers: [],
                        following: []
                    };
                    db.insertOne(user)
                        .then((acknowledged) => {
                            if(!acknowledged) {
                                resolve({ status: 'error', error: 'Failed to add new user. Please try again later.' });
                                return;
                            }
                            var msg = 'Created new user: ' + req.username;
                            console.log(msg);
                            resolve({ status: 'OK', msg: msg });
                        });
                });
        });
    }

}
