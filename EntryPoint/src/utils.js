module.exports = {
  send_response: function(res, json){
    if(json.status == "error"){
      res.statusCode = 200;
      res.json(json);
      return true;
    }else if(json.status == "OK"){
      res.statusCode = 200;
      res.json(json);
      return true;
    }
  }
}
