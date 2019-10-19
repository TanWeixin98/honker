var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.listen(8080);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
