import React, {Component} from  'react';

class Tweet extends Component{

  constructor(props){
    super(props);
    this.state = {
      username: this.props.username,
      tweet_id : this.props.id,
      likes : this.props.likes,
      liked : false,
      time : this.props.time,
      content: this.props.content
    }
  }

  render() {
    return(
      <div class = 'container'>
        <div class ='row'>
          <div class = 'col-sm-1 tweet_user_display'>
            <img class = 'user_thumbnail' src = 'https://image.shutterstock.com/z/stock-vector-profile-blank-icon-empty-photo-of-male-gray-person-picture-isolated-on-white-background-good-535853269.jpg'/>
            <a>{this.state.username}</a>
          </div>
        
          <div class = 'col-8 tweet_content_info'>
            <p class = 'tweet_content'>{this.state.content}</p>
            <div class = "tweet_time_and_buttons">
              <button class = 'btn-xs btn-primary tweet_btn' onClick = {this.handleLike}><i class="fa fa-thumbs-up">{this.state.likes}Likes</i></button>
              <button class = 'btn-xs btn-primary tweet_btn'>Comments</button>
              <span>{this.state.time}</span>
            </div>
          </div>
        </div>
      </div>
    ); 
  }

  handleLike = () =>{
    //TODO update likes in backend
    if(this.state.liked){
      this.setState({ likes : this.state.likes - 1 });
    }else{
      this.setState({ likes : this.state.likes + 1});
    }
    this.setState({ liked :  !this.state.liked});
  }
}


export default Tweet;
