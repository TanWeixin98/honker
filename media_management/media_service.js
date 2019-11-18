const express = require('express');
const fs = require('fs');
const path = require('path');
const body_parser = require('body-parser');
const mime = require('mime');
const uuidv4 = require('uuid/v4');

const Logger = require('./utils/logger.js');
const mongodb = require('./utils/mongodb.js'); 

const mongo_ip = "130.245.168.214";
const mongo_url = "mongodb://" + mongo_ip + "/media";
const home_dir = require('os').homedir(); 

//TODO temp port
var port = 9000;

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

app.listen(port, () => {console.log('Media services listening on port ' + port); });

//store item into fs
app.post('/media', upload.any(), function(req, res){
        var file =  req.files[0].path;
        var id = uuidv4();
        var data = {id: id, path: file, associate: false};
        
        var fileType = mime.getType(file).match(/\w*$/g)[0];
        var new_path = path.join(media_dir, id + '.' + fileType);
        res.contentType("application/json");

        mongodb.add("media", {"id":id, "type": fileType}, function(err){
                if(err){
                        res.statusCode = 500;
                        res.json({"status": "error", "error":"Unable to store in server"});
                        res.end();
                }else{
                        fs.rename(file, new_path, err => {
                            if(err){
                                res.statusCode = 500;
                                res.json({"status": "error", "error":"Unable to store in server"});
                            }else{
                                res.statusCode = 200;
                                res.json({"status" : "OK", "id": id});
                            }
                            res.end();
                        });
                }   
        });
});

//verify file exist in system
app.get('/lookup/:id', function (req, res, next){ 
        var id = req.params.id;
        
        get_extension(id)
                .then(fileType => {
                    res.statusCode = 200;
                    res.end();
                })
                .catch(err => {
                    res.statusCode = 404;
                    res.end();
                })
});

//get media in system
app.get('/media/:id', function(req, res, next){
        var id = req.params.id;

        get_extension(id)
                .then(fileType =>{
                    console.log(fileType)
                    var file = path.join(media_dir, id+"."+ fileType);
                    fs.readFile(file, function(err, data){
                        if(err){
                            res.statusCode = 404;
                            res.end();
                        }else{
                            res.statusCode = 200;
                            res.contentType(mime.getType(file)).sendFile(file) 
                        }
                    });
                })
                .catch(err => {
                    res.statusCode = 404;
                    res.end();
                });
});

//remove file from system
app.delete('/media/:id', function(req, res, next){
        var id = req.params.id;

        get_extension(id)
                .then(fileType =>{
                    var file = path.join(media_dir, id+"."+fileType);
                    fs.unlink(file, function(err){
                        if(err){
                            res.statusCode = 500;
                            res.end();
                        }else{
                            mongodb.remove("media", {id:id}, function(err, result){
                                  if(err) res.statusCode = 500;
                                  else if(result.result.n != 1) res.statusCode = 500;
                                  else res.statusCode = 200;
                                  res.end();
                        });
                        }
                    });
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.end();
                });
});

function get_extension(id){
    return new Promise(function(resolve, reject){
        mongodb.search('media', {id:id}, {}, 1, {}, function(err, result){
            if(err) reject(err);
            if(result == null) reject(null);
            else resolve(result[0].type);
        });
    });
}
