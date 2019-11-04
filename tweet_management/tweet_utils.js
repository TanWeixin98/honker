
module.exports = {

  filter_tweets : function(tweets, following_list, limit){
    var tweets_following = [];
    tweets.forEach(function(tweet) {
      if(limit == 0){
        return tweets_following;
      }
      if(following_list.indexOf(tweet.username) >= 0){
        tweets_following.push(tweet);
        limit = limit  - 1;
      }
    });
    return tweets_following;
  }
}
