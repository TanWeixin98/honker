import React, { Component } from 'react'
import Tweet from './Tweet'

class PostList extends Component {
    
    state = {
        posts: null,
        usage: undefined,
        currentUser: null
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.location && nextProps.location.state){
            let newState = nextProps.location.state
            return { posts: newState.posts, usage: newState.usage, currentUser: newState.currentUser }
        }
        else if (nextProps)
            return { posts: nextProps.posts, usage: nextProps.usage, currentUser: nextProps.currentUser }
        else
            return null
    }

    render = () => {
        var searchResults = this.state.posts && this.state.posts.length ? this.state.posts.map(post => {
            return <Tweet key={post._id}
                username={post.username}
                tweet_id={post.id}
                content={post.content}
                time={post.timestamp}
                likes={post.likes} 
                currentUser={this.state.currentUser}/>
        }) : <div style={{ textAlign: "center" }}>No honks found</div>

        return (
            <div>
                <h1 style={{ textAlign: "center" }}>{this.state.usage}</h1>
                {searchResults}
            </div>
        )
    }
}

export default PostList