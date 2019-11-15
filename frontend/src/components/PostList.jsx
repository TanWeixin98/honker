import React, { Component } from 'react'
import Tweet from './Tweet'

class PostList extends Component {
    
    state = {
        posts: null,
        usage: undefined
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.location && nextProps.location.state)
            return { posts: nextProps.location.state.posts, usage: nextProps.location.state.usage }
        else if (nextProps)
            return { posts: nextProps.posts, usage: nextProps.usage }
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
                likes={post.likes} />
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