import React, {Component} from 'react'
import Tweet from './Tweet'
import {toast} from 'react-toastify';

class PostList extends Component {

    state = {
        posts: null,
        usage: undefined,
        currentUser: null
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.location && nextProps.location.state) {
            let newState = nextProps.location.state
            return {posts: newState.posts, usage: newState.usage, currentUser: newState.currentUser}
        } else if (nextProps)
            return {posts: nextProps.posts, usage: nextProps.usage, currentUser: nextProps.currentUser}
        else
            return null
    }

    render = () => {
        var searchResults = this.state.posts && this.state.posts.length ? this.state.posts.map((post, index) => {
            return <Tweet key={post._id}
                          index={index}
                          username={post.username}
                          id={post.id}
                          content={post.content}
                          time={post.timestamp}
                          likes={post.property.likes}
                          currentUser={this.state.currentUser}
                          deleteHandler={this.removePost}
            />
        }) : <div style={{textAlign: "center"}}>No honks found</div>

        return (
            <div>
                <h1 style={{textAlign: "center"}}>{this.state.usage}</h1>
                {searchResults}
            </div>
        )
    }

    removePost = (index) => {
        this.setState(prevState => {
            return {posts: prevState.posts.splice(index,1)}
        })
        toast.success('Honk deleted')
    }
}

toast.configure({
    autoClose: 3000,
    draggable: false,
    position: toast.POSITION.BOTTOM_RIGHT
})

export default PostList