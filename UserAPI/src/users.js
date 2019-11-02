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
    },

    getUser: (req) => {
        return new Promise((resolve, reject) => {
            db.findOne({ username: req.username })
                .then((user) => {
                    if(user == null){
                        msg = req.username + ' does not exist'
                        resolve({ status: 'error', error: msg});
                        console.log(msg);
                    }
                    else{
                        console.log(user);
                        resolve({ status: 'OK', user: { email: user.email, followers: user.followerCount, following: user.followingCount } });
                    }
                });
        });
    },

    followUser: (req) => {
        return new Promise((resolve, reject) => {
            db.findOne({ username: req.follower })
                .then((follower) => {
                    if(follower == null){
                        msg = req.follower + ' does not exist and cannot follow someone else.'
                        console.log(msg);
                        resolve({ status: 'error', error: msg });
                        return;
                    }
                    db.findOne({ username: req.followee })
                        .then((followee) => {
                            if(followee == null){
                                msg = req.followee + ' does not exist and cannot be followed.'
                                console.log(msg);
                                resolve({ status: 'error', error: msg });
                                return;
                            }
                            var followerIndex = followee.followers.indexOf(follower.username); // Index of follower in followee's followers
                            var followeeIndex = follower.following.indexOf(followee.username); // Index of followee in follower's following
                            if(req.toFollow){
                                if(followeeIndex == -1){
                                    follower.followingCount += 1;
                                    follower.following.push(followee.username);
                                }
                                if(followerIndex == -1){
                                    followee.followerCount += 1;
                                    followee.followers.push(follower.username);
                                }
                                console.log(follower.username + ' has folllowed ' + followee.username);
                            }
                            else{
                                if(followerIndex > -1){
                                    follower.followingCount -= 1;
                                    if(followeeIndex > -1)
                                        follower.following.splice(followeeIndex, 1);
                                }
                                if(followeeIndex > -1){
                                    followee.followerCount -= 1;
                                    if(followerIndex > -1)
                                        followee.followers.splice(followerIndex, 1);
                                }
                                console.log(follower.username + ' has unfollowed ' + followee.username);
                            }

                            db.updateOne({ username: follower.username }, { $set: { followingCount: follower.followingCount, following: follower.following  } })
                            db.updateOne({ username: followee.username }, { $set: { followerCount: followee.followerCount, followers: followee.followers  } })
                            resolve({ status: 'OK' });
                        });
                });
        });
    }
}
