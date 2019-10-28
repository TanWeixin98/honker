var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var path = require('path');

var app = express();
app.listen(8000, () => { console.log('EntryPoint is listening on port 8000'); });

console.log(path.resolve(__dirname, '../../EntryPoint'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('TeamLiquid :('));
app.use(cors(
    {
        origin:' http://localhost:3000',
        credentials: true
    }
));
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));
app.get('*', (req, res) => { res.sendFile('index.html', {root: path.resolve(__dirname, '../../frontend/build')}) });

const messenger = require( './clientMessenger' );
messenger.createClient();

const cookies = require( './cookies' );
const utils = require('./utils')
const request_checker = require('./request_checker.js');
request_checker.init(app);

app.post('/addUser', (req, res, next) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'addUser', 'UserAuth')
        .then((response) => res.json(response));
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

//tweet
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

app.post('/search', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var json = request_checker.search_item_check(req.body);
    if(utils.send_response(res, json) == true) return;

    messenger.sendRPCMessage(JSON.stringify(json), "", "search_item")
        .then((response) => utils.send_response(res, response));
});

app.get('/item/:id', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;

    messenger.sendRPCMessage(JSON.stringify({"id" : id }), "", "search_item")
        .then((response) => utils.send_response(res, response));
});
