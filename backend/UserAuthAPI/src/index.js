var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
app.listen(8080);
console.log('Listening on port 8080');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var userAuth;

var dbUtils = require( './dbUtils' );
dbUtils.connectToServer((err, client) => {
    if(err) console.log(err);
    else{
        userAuth = require('./userAuth');
    }
});

app.get('/', (req, res) => { console.log('xasdsad'); res.json({msg: 'hi'}) });

app.post('/adduser', (req, res) => userAuth.addUser(req, res));

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({msg: "error"});
});
*/

module.exports = app;
