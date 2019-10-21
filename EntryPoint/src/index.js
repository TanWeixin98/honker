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
const request_filter = require('./request_process.js');
request_filter.init(app);

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
        .then((response) => {
            if(response.status == 'OK')
                res.cookie('authToken', cookies.createAuthToken(req.body.email), { signed: true });
            res.json(response);
        });
});

app.post('/logout', (req, res) => {
    var email =  cookies.clearAuthToken(req, res);
    messenger.sendRPCMessage(JSON.stringify({email: email}), 'logout')
        .then((response) => res.json(response));
});

//tweet
app.post('/additem', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if(!request_filter.verify(req,res,cookies)) return
    var username = "test";
    var json = request_filter.add_item_check(req.body, username);
    if(json.status == "error"){
      res.statusCode = 500;
      res.json(json);
      return;
    }
    messenger.sendRPCMessage(JSON.stringify(json), undefined, "add_item")
        .then((response) => res.json(response));
});

app.post('/search', (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    if(!request_filter.verify(req,res,cookies)) return
    var json = request_filter.search_item_check(req.body);
    if(json.status == "error"){
      res.statusCode = 500;
      res.json(json);
      return;
    }
    messenger.sendRPCMessage(JSON.stringify(json), undefined, "search_item")
        .then((response) => res.json(response));
});

app.get('/item/:id', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  if(!request_filter.verify(req,res,cookies)) return
  var id = req.params.id;
  messenger.sendRPCMessage(JSON.stringify({"id" : id }), undefined, "search_item")
        .then((response) => res.json(response));
});
