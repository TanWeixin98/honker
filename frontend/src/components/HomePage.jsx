import React, { Component } from 'react'
import { Toast } from 'react-bootstrap'
import API from '../constants'
import PostList from './PostList'
import PostItem from './PostItem'

class HomePage extends Component {

    state = {
        posts: null,
        hasFetched: false,
        showPostSuccessToast: false,
        currentUser: null
    }

    constructor(props) {
        super(props)
        this.fetchPosts()
    }

    render = () => {
        var posts = this.state.hasFetched ? <PostList posts={this.state.posts} currentUser={this.state.currentUser}/> : ''


        return (
            <div>
                {/* <Toast onClose={() => this.setState({ showPostSuccessToast: false })} show={this.state.showPostSuccessToast} showdelay={2000} autohide animation={true}>
                    <Toast.Header>
                        <strong className="mr-auto">Your Honk was submitted</strong>
                    </Toast.Header>
                    <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
                </Toast> */}
                <PostItem handleRefresh={this.handleRefresh} />
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