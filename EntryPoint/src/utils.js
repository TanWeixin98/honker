var axios = require('axios');    

module.exports = {
  send_response: function(res, json){
    if(json.status == "error"){
      res.statusCode = 500;
      res.json(json);
      return true;
    }else if(json.status == "OK"){
      res.statusCode = 200;
      res.json(json);
      return true;
    }
  },

  delete_media_promises: function(url, media_list){
    var promises = []; 
    media_list.forEach(element => {
      promises.push(new Promise(function(resolve, reject){
         axios.delete(url + element)
            .then( res => {
                    resolve(res);
            })
            .catch( err =>{
                    reject(err);
            });
      })); 
    });
    return promises;
  },

  update_media_promises : function(){
      var promises = [];
      media_list.forEach(element =>{
        promises.push(new Promise(function(resolve, reject){
            axios.get(url+element)
                .then(res => resolve(res))
                .catch(err => reject(err))
        
        }));
      });
      return promises;
  },

  lookup_media_promises : function(url, media_list){
    var promises = [];
    media_list.forEach(element =>{
      promises.push(new Promise(function(resolve, reject){
        axios.get(url + element)
                .then(res => {
                        resolve(res)
                })
                .catch(err =>{
                        reject(err)
                });
      }));
    }, function(callback){
       
    });
    return  promises;
  }
}
