import React, { Component } from 'react'
import { Form, Container, Button, Row, Alert, Modal } from 'react-bootstrap'
import API from '../constants'
import PostList from './PostList'

class HomePage extends Component {

    state = {
        posts: null,
        hasFetched: false
    }

    constructor(props){
        super(props)
        console.log('home')
        this.fetchPosts()
    }
    render = () => {
        var posts = this.state.hasFetched ? <PostList posts={this.state.posts}/> : ''
        return (
            <div>
                {posts}
            </div>
        )
    }

    fetchPosts = () => {
        const url = API + '/search'
        var payload = { following: true }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ posts: response.items, hasFetched: true })
            })
    }
}

export default HomePage