var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var path = require('path');
var pino = require('express-pino-logger')()

var app = express();
app.listen(8000, () => { console.log('EntryPoint is listening on port 8000'); });

console.log(path.resolve(__dirname, '../../EntryPoint'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('TeamLiquid :('));
app.use(cors(
    {
        origin:' http://localhost:3000',
        credentials: true
    }
));
app.use(pino)

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
            if(UserAuthResponse.status == 'OK')
                UserAPIResponse: messenger.sendRPCMessage(
                    JSON.stringify({username: req.body.username, email: req.body.email}),
                    'addUser', 'UserAPI')
                    .then((UserAPIResponse) => {
                        if(UserAPIResponse.status == 'OK')
                            res.json(UserAuthResponse);
                        else
                            res.json({ status: 'error', error: 'Internal error. Please try signing up again.' });
                    })
            else{
                res.json(UserAuthResponse);
                return;
            }
        });
});

app.post('/verify', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'verify', 'UserAuth')
        .then((response) => res.json(response));
});

app.post('/login', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'login', 'UserAuth')
        .then((response) => {
            if(response.status == 'OK')
                res.cookie('authToken', cookies.createAuthToken(req.body.username), { signed: true });
            res.json(response);
        });
});

app.post('/logout', (req, res, next) => {
    var username =  cookies.clearAuthToken(req, res, next);
    messenger.sendRPCMessage(JSON.stringify({username: username}), 'logout', 'UserAuth')
        .then((response) => res.json(response));
});

// UserAPI -Brian
app.get('/user/:username', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify({username: req.params.username}), 'getUser', 'UserAPI')
        .then((response) => res.json(response));
});


app.get('/user/:username/posts', (req, res, next) => {
    var limit = request_checker.checkLimit(req.query.limit)
    console.log('limit:', limit)
    var currentTime = Math.round((new Date()).getTime() / 1000);
    if(limit == null){
        res.json({ status: 'error', error: 'The provided limit is invalid' })
        return;
    }
    messenger.sendRPCMessage(JSON.stringify({ username: req.params.username, getIDOnly: true, limit: limit, timestamp: currentTime }), '', 'search_item')
        .then((response) => res.json(response));
});

app.get('/user/:username/followers', (req, res, next) => {
    var limit = request_checker.checkLimit(req.query.limit)
    var currentTime = Math.round((new Date()).getTime() / 1000);
    if(limit == null){
        res.json({ status: 'error', error: 'The provided limit is invalid' })
        return;
    }
    messenger.sendRPCMessage(JSON.stringify({ username: req.params.username, limit: limit }), 'getFollowers', 'UserAPI')
        .then((response) => res.json(response));
});

app.get('/user/:username/following', (req, res, next) => {
    var limit = request_checker.checkLimit(req.query.limit)
    var currentTime = Math.round((new Date()).getTime() / 1000);
    if(limit == null){
        res.json({ status: 'error', error: 'The provided limit is invalid' })
        return;
    }
    messenger.sendRPCMessage(JSON.stringify({ username: req.params.username, limit: limit }), 'getFollowing', 'UserAPI')
        .then((response) => res.json(response));
});

app.post('/follow', (req, res, next) => {
    var follower = cookies.readAuthToken(req.signedCookies);
    if(!follower){
        res.json({ status: 'error', error: 'You must be logged in to follow.' });
        console.log('Unable to follow a user without being logged in');
        return;
    }
    var toFollow = req.body.follow==null ? true : req.body.follow;
    messenger.sendRPCMessage(JSON.stringify({ follower: follower, followee: req.body.username, toFollow: toFollow }), 'followUser', 'UserAPI')
        .then((response) => res.json(response));
});

//tweet -Weixin
app.post('/additem', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var username = cookies.readAuthToken(req.signedCookies);
    if(!request_checker.verify(username,res)) return;

    var json = request_checker.add_item_check(req.body, username);
    if(utils.send_response(res, json) == true) return;
    json['username'] = username;

    messenger.sendRPCMessage(JSON.stringify(json), "", "add_item")
        .then((response) => res.json(response));
});

app.delete('/item/:id', (req, res, next) => {
    var username = cookies.readAuthToken(req.signedCookies);
    if(!request_checker.verify(username, res)) return;

    var id = req.params.id;
    messenger.sendRPCMessage(JSON.stringify({"id":id}), "", "delete_item")
        .then((response) => utils.send_response(res, response));
});

app.post('/search', (req, res, next) => {
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
                  .then((response) => utils.send_response(res, response));
        });
    }else{
        messenger.sendRPCMessage(JSON.stringify(json), "", "search_item")
            .then((response) => utils.send_response(res, response));
    }
});

app.get('/item/:id', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;

    messenger.sendRPCMessage(JSON.stringify({"id" : id }), "", "search_item")
        .then((response) => utils.send_response(res, response));
});

app.get('*', (req, res) => { res.sendFile('index.html', {root: path.resolve(__dirname, '../../frontend/build')}) });
