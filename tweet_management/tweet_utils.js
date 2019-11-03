
module.exports = {

  filter_tweets : function(tweets, following_list){
    var tweets_following = [];
    tweets.forEach(function(tweet) {
      if(following_list.indexOf(tweet.username) >= 0)
        tweets_following.push(tweet);
    });
    return tweets_following;
  }
}
