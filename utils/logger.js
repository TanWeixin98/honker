var nodelogger = require('nodejslogger');

module.exports = class logger{
  constructor(file){
    var _dir_name = "/home/ubuntu/log/"; 
    if(file === undefined) 
      file = "logger.log";
    nodelogger.init({"file":_dir_name + file});
  }

  info(msg){
    nodelogger.info(msg);
  }

  debug(msg){
    nodelogger.debug(msg);
  }

  error(msg, err){
    nodelogger.error(msg);
    if(err !== undefined){
      nodelogger.error(err.message + '\n' + err.stack); 
    }
  }
}
