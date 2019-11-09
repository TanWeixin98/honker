import React, { Component } from 'react'
import API from '../constants'
import '../css/UserProfile.css'
import { Container, Col, Row, Nav, Button } from 'react-bootstrap';
import UserList from './UserList'

const initialState = {
    username: null,
    followerCount: null,
    followingCount: null,
    followers: null,
    following: null,
    currentView: 'Posts',
    isFollowing: false,
    currentUser: null,
    followButtonUpdated: false
}

class UserProfile extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
        this.state.username = this.props.match.params.username
        this.state.currentView = this.props.match.params.view
        this.setUserState()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.username !== prevState.username)
            return { ...initialState, username: nextProps.match.params.username }
        else
            return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.username !== this.state.username)
            this.setUserState()
    }

    render() {
        var followButton
        if (this.state.followButtonUpdated)
            followButton = <Button onClick={this.handleFollow} style={{ visibility: (this.state.isFollowing == null ? 'hidden' : 'visible') }}>
                {this.state.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>

        var userView
        switch(this.state.currentView){
            case 'posts':
                userView = 'Posts'
                break
            case 'followers':
                userView = <UserList userList={this.state.followers} username={this.state.username} view='Followers'/>
                break
            case 'following':
                userView = <UserList userList={this.state.following} username={this.state.username} view='Following'/>
                break
            default:
                userView = <div/>
        }

        return (
            <Container className='UserProfileContainer'>
                <Row>
                    <Col className='UserProfileCol'>
                        <Nav className="flex-column" onSelect={this.handleSelect}>
                            <h2 className='centered'>@{this.state.username}</h2>
                            {followButton}
                            <br />
                            <Nav.Link eventKey="posts">Posts</Nav.Link>
                            <Nav.Link eventKey="followers">Followers ({this.state.followerCount})</Nav.Link>
                            <Nav.Link eventKey="following">Following ({this.state.followingCount})</Nav.Link>
                        </Nav>
                    </Col>
                    <Col>
                        {userView}
                    </Col>
                </Row>

            </Container>

        )
    }

    handleSelect = (selectedKey) => {
        this.setState({ currentView: selectedKey })
        if(selectedKey == 'posts')
            this.props.history.push('/' + this.state.username)
        else
            this.props.history.push('/' + this.state.username + '/' + selectedKey)
    }

    handleFollow = () => {
        var url = API + '/follow'
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ username: this.state.username, follow: !this.state.isFollowing }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(res => {
                this.setState({ isFollowing: !this.state.isFollowing })
            })
            .catch(error => console.error(error))
    }

    setUserState = () => {
        this.getCurrentUser()
        this.getUser()
        this.getFollowers()
        this.getFollowing()
    }

    getUser = () => {
        var url = API + '/user/' + this.state.username
        fetch(url, { credentials: 'include' })
            .then(response => response.json())
            .then(res => {
                this.setState({
                    followerCount: res.user.followers,
                    followingCount: res.user.following
                })
            })
            .catch(error => console.error(error))
    }

    getCurrentUser = () => {
        return new Promise((resolve) => {
            console.log('getCurrentUser')
            const url = API + '/currentUser'
            fetch(url, { credentials: 'include' })
                .then(response => response.json())
                .then(res => {
                    if (res.username == this.state.username)
                        this.setState({ isFollowing: null })
                    else
                        this.setState({ currentUser: res.username }, this.setFollowState)
                })
                .catch(error => console.error(error))
        })

    }

    getFollowers = () => {
        var url = API + '/user/' + this.state.username + '/followers'
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({ followers: res.users }, this.setFollowState)
            })
            .catch(error => console.error(error))
    }

    getFollowing = () => {
        var url = API + '/user/' + this.state.username + '/following'
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({ following: res.users })
            })
            .catch(error => console.error(error))
    }

    setFollowState = () => {
        if (!this.state.followButtonUpdated && this.state.currentUser && this.state.followers) {
            console.log('setFollowState')
            this.setState({
                isFollowing: this.state.followers.includes(this.state.currentUser),
                followButtonUpdated: true
            })
        }

    }
}

export default UserProfile