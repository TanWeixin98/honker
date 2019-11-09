import React, { Component } from 'react'
import API from '../constants'
import '../css/UserProfile.css'
import { Container, Col, Row, Nav, Button } from 'react-bootstrap';

class UserProfile extends Component {

    state = {
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

    constructor(props) {
        super(props)
        this.state.username = this.props.location.pathname.slice(1)
        this.setUserState()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.username !== prevState.username)
            return { username: nextProps.match.params.username };
        else
            return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.username !== this.state.username)
            this.setUserState()
    }

    render() {
        var followButton = undefined;
        if(this.state.isFollowing != null)
            followButton = <Button onClick={this.handleFollow}>{this.state.isFollowing ? 'Unfollow' : 'Follow'}</Button>
        return (
            <Container className='UserProfileContainer'>
                <Row>
                    <Col className='UserProfileCol'>
                        <Nav className="flex-column" onSelect={this.handleSelect}>
                            <h2 className='centered'>@{this.state.username}</h2>
                            {followButton}
                            <br />
                            <Nav.Link eventKey="Posts">Posts</Nav.Link>
                            <Nav.Link eventKey="Follower">Follower</Nav.Link>
                            <Nav.Link eventKey="Following">Following</Nav.Link>
                        </Nav>
                    </Col>
                    <Col>
                        {this.state.currentView}
                        <br />
                        {this.state.followers}
                        <br />
                        {this.state.following}
                    </Col>
                </Row>

            </Container>

        )
    }

    handleSelect = (selectedKey) => {
        this.setState({ currentView: selectedKey })
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