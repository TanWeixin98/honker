
module.exports = {

  filter_tweets : function(tweets, follower_list){
    var tweets_following = [];
    tweets.forEach(function(tweet) {
      if(follower_list.indexOf(tweet.username) >= 0)
        tweets_following.push(tweet);
    });
    return tweets_following;
  }
}
