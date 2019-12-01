import React, {Component} from 'react'
import API from '../constants'
import '../css/UserProfile.css'
import {Container, Col, Row, Nav, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import UserList from './UserList'
import PostList from './PostList';

const initialState = {
    username: null,
    followerCount: null,
    followingCount: null,
    followers: null,
    following: null,
    posts: null,
    currentView: null,
    isFollowing: false,
    currentUser: null,
    followButtonUpdated: false,
    error: false
}

class UserProfile extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
        this.state.username = this.props.match.params.username
        if (this.props.match.params.view) this.state.currentView = this.props.match.params.view
        this.setUserState()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.username !== prevState.username) {
            return {...initialState, username: nextProps.match.params.username}
        } else if (nextProps.match.params.view !== prevState.currentView) {
            return {currentView: nextProps.match.params.view ? nextProps.match.params.view : 'posts'}
        } else
            return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.username !== this.state.username)
            this.setUserState()
    }

    render() {
        var followButton
        if (this.state.followButtonUpdated && this.state.username !== this.state.currentUser)
            followButton = <Button onClick={this.handleFollow}
                                   style={{visibility: (this.state.isFollowing == null ? 'hidden' : 'visible')}}>
                {this.state.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>

        var userView
        if (!this.state.error)
            switch (this.state.currentView) {
                case 'posts':
                    userView = <PostList posts={this.state.posts} currentUser={this.state.currentUser}/>
                    break
                case 'followers':
                    userView =
                        <UserList userList={this.state.followers} username={this.state.username} view='Followers'/>
                    break
                case 'following':
                    userView =
                        <UserList userList={this.state.following} username={this.state.username} view='Following'/>
                    break
                default:
                    userView = undefined
            }
        else
            userView = 'This user does not exist'

        return (
            <Container className='UserProfileContainer'>
                <Row>
                    <Col className='UserProfileCol'>
                        <Nav className="flex-column">
                            <h2 className='centered'>@{this.state.username}</h2>
                            {followButton}
                            <br/>
                            <Link to={'/' + this.state.username} eventkey="posts" replace>Posts</Link>
                            <Link to={'/' + this.state.username + '/followers'}
                                  replace>Followers{this.state.followerCount ? ` (${this.state.followerCount})` : ''}</Link>
                            <Link to={'/' + this.state.username + '/following'}
                                  replace>Following{this.state.followingCount ? ` (${this.state.followingCount})` : ''}</Link>
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
        // this.setState({ currentView: selectedKey })
        // if (selectedKey !== 'posts')
        // //     this.props.history.push('/' + this.state.username)
        // // else
        //     this.props.history.push('/' + this.state.username + '/' + selectedKey)
    }

    handleFollow = () => {
        if (this.state.error) return
        var url = API + '/follow'
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({username: this.state.username, follow: !this.state.isFollowing}),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.status === 'OK')
                    this.setState(prevState => {
                        return {
                            isFollowing: !prevState.isFollowing,
                            followerCount: prevState.followerCount + (prevState.isFollowing ? -1 : 1)
                        }
                    })
            })
            .catch(error => console.error(error))
    }

    setUserState = () => {
        this.getCurrentUser()
        this.getUser()
        this.getPosts()
        this.getFollowers()
        this.getFollowing()
    }

    getUser = () => {
        if (this.state.error) return
        var url = API + '/user/' + this.state.username
        fetch(url, {credentials: 'include'})
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    this.setState({error: true})
                    return
                }
                this.setState({
                    followerCount: res.user.followers,
                    followingCount: res.user.following,
                    currentView: this.state.currentView ? this.state.currentView : 'posts'
                })
            })
            .catch(error => console.error(error))
    }

    getCurrentUser = () => {
        if (this.state.error) return
        return new Promise((resolve) => {
            const url = API + '/currentUser'
            fetch(url, {credentials: 'include'})
                .then(response => response.json())
                .then(res => {
                    if (res.username === this.state.username)
                        this.setState({isFollowing: null})
                    else
                        this.setState({currentUser: res.username}, this.setFollowState)
                })
                .catch(error => console.error(error))
        })

    }

    getFollowers = () => {
        if (this.state.error) return
        var url = API + '/user/' + this.state.username + '/followers'
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({followers: res.users}, this.setFollowState)
            })
            .catch(error => console.error(error))
    }

    getFollowing = () => {
        if (this.state.error) return
        var url = API + '/user/' + this.state.username + '/following'
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.setState({following: res.users})
            })
            .catch(error => console.error(error))
    }

    getPosts = () => {
        if (this.state.error) return
        const url = API + '/search'
        var payload = {username: this.state.username, following: false, rank:'time'}

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
                this.setState({posts: response.items, currentUser: response.currentUser})
            })
    }

    setFollowState = () => {
        if (!this.state.followButtonUpdated && this.state.currentUser && this.state.followers) {
            this.setState({
                isFollowing: this.state.currentUser !== this.state.username ? this.state.followers.includes(this.state.currentUser) : false,
                followButtonUpdated: true
            })
        }

    }
}

export default UserProfile