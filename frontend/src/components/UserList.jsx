import React, { Component } from "react"
import { Container, Col, Row, Nav } from 'react-bootstrap';
import { LinkContainer, Link } from "react-router-bootstrap";

class UserList extends Component {

    state = {
        currentView: null,
        userList: null,
        username: null
    }

    static getDerivedStateFromProps(props, state) {
        return { userList: props.userList, currentView: props.view, username: props.username }
    }

    render() {
        return (
            <Container>
                <h1>{this.state.currentView}</h1>
                <Col>
                    {this.mapUserList()}
                </Col>
            </Container>
        )
    }

    mapUserList = () => {
        if (this.state.userList != null)
            return this.state.userList.map(username => <LinkContainer to={'/'+username} key={username}><Nav.Link>{username}</Nav.Link></LinkContainer>)
        else
            return <p>{this.state.currentView == 'Followers' ? this.state.username + ' has no followers' : this.state.username + ' is not following anyone'}</p>
    }
}

export default UserList