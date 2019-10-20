var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.listen(8000, () => { console.log('EntryPoint is listening on port 8000'); });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('TeamLiquid :('));

const messenger = require( './clientMessenger' );
messenger.createClient();

const cookies = require( './cookies' );

app.post('/addUser', (req, res) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'addUser')
        .then((response) => res.json(response));
});

app.post('/verify', (req, res) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'verify')
        .then((response) => res.json(response));
});

app.post('/login', (req, res) => {
    messenger.sendRPCMessage(JSON.stringify(req.body), 'login')
        .then((response) => res.json(response));
});

app.post('/logout', (req, res) => {
    var email =  cookies.clearAuthToken(req, res);
    messenger.sendRPCMessage(JSON.stringify({email: email}), 'logout')
        .then((response) => res.json(response));
});
