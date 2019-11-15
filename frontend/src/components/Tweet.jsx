import React, { Component } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { LinkContainer, Link } from "react-router-bootstrap";
import './../css/tweet.css';

class Tweet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      tweet_id: this.props.id,
      likes: this.props.likes,
      liked: false,
      time: this.props.time,
      content: this.props.content
    }
  }

  render() {
    return (
      <Container className='Tweet'>
        <Row>
          <Col md='auto'>
            <img className='user_thumbnail' src='https://image.shutterstock.com/z/stock-vector-profile-blank-icon-empty-photo-of-male-gray-person-picture-isolated-on-white-background-good-535853269.jpg' alt={this.state.usernam} />
          </Col>
          <Col>
            <div className='tweet_username'>
              <LinkContainer className='profileLink' to={'/' + this.state.username}><Nav.Link>{this.state.username}</Nav.Link></LinkContainer>
            </div>
            <div className='tweet_time'>
              <span>{this.convertTs(this.state.time)}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <div className='tweet_content'>
            {this.createMentionLinks()}
          </div>
        </Row>
        <Row>
          <div className='likes_and_retweet'>
            <button className='btn-xs btn-primary like_btn' onClick={this.handleLike}><i className="fa fa-thumbs-up">{this.state.likes}Likes</i></button>
            <button className='btn-xs btn-primary tweet_btn'>Retweet</button>
          </div>
        </Row>
      </Container>
    );
  }

  convertTs = (ts) => {
    var ts = new Date(Math.round(ts * 1000));
    return ts.toLocaleString();
  }

  handleLike = () => {
    //TODO update likes in backend
    if (this.state.liked) {
      this.setState({ likes: this.state.likes - 1 });
    } else {
      this.setState({ likes: this.state.likes + 1 });
    }
    this.setState({ liked: !this.state.liked });
  }

  createMentionLinks = (text) => {
    const regexp = RegExp('@([a-z\d_\[0-9]+)', 'gi')
    const str = this.state.content
    let matches = str.matchAll(regexp)
    var components = []
    var lastMentionEndIndex = 0

    for (let match of matches) {
      components.push(str.substring(lastMentionEndIndex, match.index))
      components.push(<LinkContainer className='profileLink' to={'/' + match[1]} key={match.index}><Nav.Link>{match[0]}</Nav.Link></LinkContainer>)
      lastMentionEndIndex = match.index + match[0].length
    }
    if (lastMentionEndIndex != str.length) 
      components.push(str.substring(lastMentionEndIndex))

    return <>{components}</>
  }


}


export default Tweet;
