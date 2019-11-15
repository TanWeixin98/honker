import React, { Component } from 'react'
import { Form, Container, Button, Row } from 'react-bootstrap'
import Tweet from './Tweet'

class Search extends Component {
    state = {
        posts: null
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.location.state)
            return { posts: nextProps.location.state.posts }
        else
            return null
    }

    render = () => {
        var searchResults = this.state.posts ? this.state.posts.map(post => {
            return <Tweet key={post._id}
                username={post.username}
                tweet_id={post.id}
                content={post.content}
                time={post.timestamp}
                likes={post.likes} />
        }) : undefined
        return (
            <div>
                <h1>Search results</h1>
                {searchResults}
            </div>
        )
    }
}

export default Search