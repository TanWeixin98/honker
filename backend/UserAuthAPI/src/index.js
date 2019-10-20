var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');

var app = express();
app.listen(8080);
app.use('/', express.static(path.join(process.cwd(), '/build')));
//Use this in master
//console.log(path.resolve(__dirname, '../../..'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('TeamLiquidWillWinWorlds'));
console.log('Listening on port 8080');

var dbUtils = require( './dbUtils' );
dbUtils.connectToServer((err, client) => {
    if(err) console.log(err);
    else{
        userAuth = require('./userAuth');
    }
});

var userAuth;

app.post('/adduser', (req, res) => userAuth.addUser(req, res));

app.post('/verify', (req, res) => userAuth.verifyUser(req, res));

app.post('/login', (req, res) => userAuth.loginUser(req, res));

app.post('/logout', (req, res) => userAuth.logoutUser(req, res));
