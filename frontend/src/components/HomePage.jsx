import React, { Component } from 'react'
import API from '../constants'
import '../css/HomePage.css'
import PostList from './PostList'

class HomePage extends Component {

    state = {
        posts: null,
        hasFetched: false,
        showPostSuccessToast: false,
        currentUser: null,
        showAddPostModal: false
    }

    constructor(props) {
        super(props)
        this.fetchPosts()
    }

    render = () => {
        var posts = this.state.hasFetched ? <PostList posts={this.state.posts} currentUser={this.state.currentUser}/> : ''

        return (
            <div>
                <hr />
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
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ posts: response.items, hasFetched: true, currentUser: response.currentUser })
            })
    }

    handleRefresh = () => {
        this.setState({ showPostSuccessToast: true })
        this.fetchPosts()
    }
}

export default HomePage