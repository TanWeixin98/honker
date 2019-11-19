
module.exports = {

  filter_tweets : function(tweets, following_list, replies, parent_id, has_media, limit){
    var tweets_following = [];
    tweets.forEach(function(tweet) {
      if(limit == 0){
        return tweets_following;
      }
      if(tweet_selection(tweet, following_list, replies, parent_id, has_media) != null){
        tweets_following.push(tweet);
        limit = limit - 1;
      }
    });
    return tweets_following;
  }

}

function tweet_selection(tweet, following_list, replies, parent_id, has_media){    
    //console.log(tweet)
    if(has_media && tweet.media.length == 0){
      return null;
    }else if(!has_media && tweet.media.length > 0){
      return null;
    }else{
      if(!replies && tweet.childType == "reply"){
        return null;
      }
        //console.log(parent_id)
      if(parent_id !== undefined  && parent_id != tweet.parent){
        return null;
      }
      if(following_list !== undefined && following_list.indexOf(tweet.username) < 0){
        return null
      }
      return tweet;
    }
}
