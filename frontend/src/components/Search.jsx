import React, { Component } from 'react'
import { Form, Container, Button, Row } from 'react-bootstrap'

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
        var searchResults = this.state.posts ? this.state.posts.map(post => { return <div key={post._id}>{post.username}: "{post.content}"</div> }) : undefined
        return (
            <div>
                <h1>Search results</h1>
                {searchResults}
            </div>
        )
    }
}

export default Search