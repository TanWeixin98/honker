import React, {Component} from  'react';
import {Container} from 'react-bootstrap';
import Tweet from './Tweet'

class Tweets extends Component{

  render() {
    return(
      <Container>
      {this.props.location.state.tweets.map((tweet) =>(
            <Tweet  username = {tweet.username}
                    tweet_id = {tweet.id}
                    content = {tweet.content}
                    time = {tweet.timestamp}
                    likes = {tweet.likes}/>
            ))}
      </Container>
    ); 
  }

}


export default Tweets;
