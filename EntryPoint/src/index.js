var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path = require('path');
var pinoOptions = require('./pinoConf')
var pino = require('pino')(pinoOptions.defaultOptions())
var pinoExpress = require('pino-express')
var axios = require('axios');
var request = require('request');

var app = express();
app.listen(8000, () => { console.log('EntryPoint is listening on port',process.env.PORT); });

//error handler
app.use(function(req, res, next){
    var err = null;
    try{
        decodeURIComponent(req.path);
    }catch(e){
        console.log(err, req.url);
        res.statusCode = 400;
        res.end();
        return;
    }
    next();
});

//TODO make json contain all ip and select from it
// For now hardcode 
var media_server = "http://localhost:9000"

app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: false,parameterLimit: 1000000 }));
app.use(cookieParser('TeamLiquid :('));
app.use(cors(
    {
        origin: (origin, callback) => { return callback(null, true); },
        credentials: true
    }
));
app.use(pinoExpress(pino, pinoOptions.defaultOptions()))

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

const messenger = require( './clientMessenger' );
messenger.createClient();

const cookies = require( './cookies' );
const utils = require('./utils')
const request_checker = require('./request_checker.js');
request_checker.init(app);

// UserAuthAPI -Brian
app.post('/addUser', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'addUser', 'UserAuth')
        .then((UserAuthResponse) => {
            if(UserAuthResponse.status == 'OK'){
                messenger.sendRPCMessage(
                    JSON.stringify({username: req.body.username, email: req.body.email}), 'addUser', 'UserAPI')
                    .then((UserAPIResponse) => {
                        if(UserAPIResponse.status == 'OK')
                            utils.send_response(res,UserAuthResponse);
                        else{
                            res.statusCode = 500;
                            res.json({ status: 'error', error: 'Internal error. Please try signing up again.' });
                        }
                    })
                messenger.sendRPCMessage(JSON.stringify({ email: req.body.email, verificationKey: UserAuthResponse.verificationKey }), null, 'Emailer')
            }
            else{
                utils.send_response(res, UserAuthResponse);
                return;
            }
        });
});

app.post('/verify', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'verify', 'UserAuth')
        .then((response) => utils.send_response(res, response));
});

app.post('/login', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'login', 'UserAuth')
        .then((response) => {
            if(response.status == 'OK')
                res.cookie('authToken', cookies.createAuthToken(req.body.username), { signed: true });
            utils.send_response(res, response);
        });
});

app.post('/logout', (req, res, next) => {
    var username =  cookies.clearAuthToken(req, res, next);
    messenger.sendRPCMessage(JSON.stringify({username: username}), 'logout', 'UserAuth')
        .then((response) => utils.send_response( res, response));
});

// UserAPI -Brian

app.get('/currentUser', (req, res, next) => {
    console.log('PORT', process.env.PORT)
    var username = cookies.readAuthToken(req.signedCookies);
    if(username == null) cookies.clearAuthToken(req, res, next);
    res.json({ username: username });
});

app.get('/user/:username', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify({username: req.params.username}), 'getUser', 'UserAPI')
        .then((response) => utils.send_response(res,response));
});


app.get('/user/:username/posts', (req, res, next) => {
    var limit = request_checker.checkLimit(req.query.limit)
    var currentTime = Math.round((new Date()).getTime() / 1000);
    if(limit == null){
        utils.send_response(res,{ status: 'error', error: 'The provided limit is invalid' })
        return;
    }
    messenger.sendRPCMessage(JSON.stringify({ username: req.params.username, getIDOnly: true, limit: limit, timestamp: currentTime }), '', 'search_item')
        .then((response) => utils.send_response(res, response));
});

app.get('/user/:username/followers', (req, res, next) => {
    var limit = request_checker.checkLimit(req.query.limit)
    var currentTime = Math.round((new Date()).getTime() / 1000);
    if(limit == null){
        utils.send_response(res, { status: 'error', error: 'The provided limit is invalid' })
        return;
    }
    messenger.sendRPCMessage(JSON.stringify({ username: req.params.username, limit: limit }), 'getFollowers', 'UserAPI')
        .then((response) => utils.send_response(res, response));
});

app.get('/user/:username/following', (req, res, next) => {
    var limit = request_checker.checkLimit(req.query.limit)
    var currentTime = Math.round((new Date()).getTime() / 1000);
    if(limit == null){
        utils.send_response(res, { status: 'error', error: 'The provided limit is invalid' })
        return;
    }
    messenger.sendRPCMessage(JSON.stringify({ username: req.params.username, limit: limit }), 'getFollowing', 'UserAPI')
        .then((response) => utils.send_response(res, response));
});

app.post('/follow', (req, res, next) => {
    var follower = cookies.readAuthToken(req.signedCookies);
    if(!follower){
        utils.send_response(res, { status: 'error', error: 'You must be logged in to follow.' });
        console.log('Unable to follow a user without being logged in');
        return;
    }
    var toFollow = req.body.follow==null ? true : req.body.follow;
    messenger.sendRPCMessage(JSON.stringify({ follower: follower, followee: req.body.username, toFollow: toFollow }), 'followUser', 'UserAPI')
        .then((response) => utils.send_response(res, response));
});

//tweet -Weixin
app.post('/additem', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var username = cookies.readAuthToken(req.signedCookies);
    if(!request_checker.verify(username,res)) return;
    var json = request_checker.add_item_check(req.body, username);
    if(utils.send_response(res, json) == true) return;
    json['username'] = username;

    if(json.media.length ==0){
        messenger.sendRPCMessage(JSON.stringify(json), "", "add_item").then((response) => res.json(response));
        return;
    }

    var base_url =  media_server + "/lookup/";
    var promises = utils.lookup_media_promises(base_url, json.media, username);

    Promise.all(promises)
        .then(() => {
            base_url = media_server + "/update/";
            promises = utils.update_media_promises(base_url, json.media);
            Promise.all(promises)
                .then(() => {
                    messenger.sendRPCMessage(JSON.stringify(json), "", "add_item")
                        .then((response) => res.json(response));
                })
                .catch(err => utils.send_response(res, {"status":"error", "error":"Update associtivity failed"}))
        })
        .catch(err =>{
            utils.send_response(res, {"status":"error", "error":"Not all media has been uploaded"}); 
        })
});

app.delete('/item/:id', (req, res, next) => {
    var username = cookies.readAuthToken(req.signedCookies);
    if(!request_checker.verify(username, res)) return;

    var id = req.params.id;
    messenger.sendRPCMessage(JSON.stringify({"_id":id, "username": username}), "", "delete_item")
        .then((response) => {
            if(response.status == 'OK'){
                var base_url = media_server + "/media/";
                var promise_list = utils.delete_media_promises(base_url, response.media);
                Promise.all(promise_list)
                    .then(res => res.statusCode = 200)
                    .catch(err => res.statusCode = 404)
                    .finally(() => res.end());
            }else{
                res.statusCode = 444;
                res.end();
            }
        });
});

app.post('/search', (req, res, next) => {
    console.log(process.env.TEST)
    res.setHeader('Content-Type', 'application/json');
    var username = cookies.readAuthToken(req.signedCookies);
    var json = request_checker.search_item_check(req.body, username);
    if(utils.send_response(res, json) == true) return;

    if(json.login_username !== undefined){
        messenger.sendRPCMessage(JSON.stringify({ username: json.login_username, limit: null }), 'getFollowing', 'UserAPI')
            .then((response) =>{
                var following_list = (response.status == 'OK') ?response.users :[];
                json['following_list'] = following_list;
                messenger.sendRPCMessage(JSON.stringify(json), "", "search_item")
                    .then((response) => {
                        response.currentUser = username;
                        utils.send_response(res, response)
                    });
            });
    }else{
        messenger.sendRPCMessage(JSON.stringify(json), "", "search_item")
            .then((response) => {
                response.currentUser = username;
                utils.send_response(res, response)
            });
    }
});

app.get('/item/:id', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;

    messenger.sendRPCMessage(JSON.stringify({"_id" : id }), "", "search_item")
        .then((response) => utils.send_response(res, response));
});

app.post('/item/:id/like', (req, res, next) => {
    var username = cookies.readAuthToken(req.signedCookies);
    if(!request_checker.verify(username, res)) return;
    var like = req.body.like;
    var id = req.params.id;

    if(like === undefined)
        like = true;
    else if(typeof like !== 'boolean'){
        utils.send_response(res, {"status":"error" , "error":"Like is not boolean"});
        return;
    }

    messenger.sendRPCMessage(JSON.stringify({_id : id , like: like, username: username}), "", "like_item")
        .then((response) => utils.send_response(res,response));
});

app.post('/addmedia', (req, res, next) => {
    var username = cookies.readAuthToken(req.signedCookies);
    if(!request_checker.verify(username, res)) return;

    var url = media_server + "/media/?username=" + username;
    req.pipe(request.get(url)).pipe(res);
})

app.get('/media/:id', (req, res, next) => {
    var id = req.params.id;
    var url = media_server + "/media/" + id;
    request.get(url).pipe(res);
});

app.get('*', (req, res) => { res.sendFile('index.html', {root: path.resolve(__dirname, '../../frontend/build')}) });
