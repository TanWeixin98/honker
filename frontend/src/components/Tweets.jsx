import React, {Component} from  'react';
import Tweet from './Tweet'

class Tweets extends Component{

  render() {
    return(
      <div class = 'container'>
      {this.props.location.state.tweets.map((tweet) =>(
            <Tweet  username = {tweet.username}
                    tweet_id = {tweet.id}
                    content = {tweet.content}
                    time = {tweet.timestamp}
                    likes = {tweet.likes}/>
            ))}
      </div>
    ); 
  }

}


export default Tweets;
