const express = require('express');
const fs = require('fs');
const path = require('path');
const body_parser = require('body-parser');
const mime = require('mime');

const Logger = require('./utils/logger.js');
const mongodb = require('./utils/mongodb.js'); 

const mongo_ip = "130.245.168.214";
const mongo_url = "mongodb://" + mongo_ip + "/media";
const home_dir = require('os').homedir(); 

var app = express();
app.use(body_parser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

var logger = new Logger("media")

var media_dir = path.join(home_dir,"/media");
if(!fs.existsSync(media_dir)) fs.mkdirSync(media_dir);

var multer = require('multer');
var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                        callback(null, media_dir);
                },

                filename: function(req, file, callback) {
                        callback(null, file.originalname + "");
                }
} );
var upload = multer({ storage: storage});

mongodb.start_connection(mongo_url, "media", function(db_err){
        if(db_err){
                logger.error("Failed to connect mongodb. " , db_err);
                return;
        }
        logger.info("Connected to mongodb");
});

app.listen(8000, () => {console.log('Media services listening on port 8000'); });

//store item into fs
app.post('/media/:id', upload.any(), function(req, res){
        var file =  req.files[0].path;
        var id = req.params.id;
        var data = {id: id, path: file, associate: false};
        mongodb.add("meedia", data, function(err){
                if(err){
                        res.statusCode = 500;
                }else{
                        res.statusCode = 200;
                }
                res.end();
        })
});

//verify file exist in system
app.get('/lookup/:id', function (req, res, next){ 
        var id = req.params.id;
        
        var file = path.join(media_dir, id);
        fs.access(file, (err) => {
                  if (err){
                          res.statusCode = 404;
                  }else{
                          res.statusCode = 200;
                  }
                  res.end();
        });
});

//get media in system
app.get('/media/:id', function(req, res, next){
        var id = req.params.id;

        var file = path.join(media_dir, id);
        fs.access(file, function(err){
                if(err){
                        res.statusCode = 404;
                        res.end();
                        return;
                }
                fs.readFile(file, function(err, data){
                        if(err){
                                res.statsCode = 500;
                                res.end();
                                return;
                        }
                        res.statusCode = 200;
                        
                        res.contentType(mime.getType(file)).end(Buffer.from(data), 'utf8')
                })
        });
});

//remove file from system
app.delete('/media/:id', function(req, res, next){
        var id = req.params.id;
      
        var file = path.join(media_dir, id);
        fs.unlink(file, function(err){
                if(err){
                        res.statusCode = 500;
                }else{
                        res.statusCode = 200;
                }
                res.end();
        });
});
