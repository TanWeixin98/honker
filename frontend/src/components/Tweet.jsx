import React, {Component} from 'react';
import {Container, Row, Col, Nav, Button, Modal} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import Likes from "./Likes";
import {toast} from 'react-toastify';
import './../css/tweet.css';
import API from "../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faReply, faTrash} from '@fortawesome/free-solid-svg-icons'

class Tweet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            id: this.props.id,
            likes: this.props.likes,
            liked: false,
            time: this.props.time,
            content: this.props.content,
            currentUser: this.props.currentUser,
            showDeleteConfirm: false
        }
    }

    render() {
        var deleteButton = this.state.currentUser === this.state.username ?
            <Button size="sm" variant="outline-*" onClick={this.handleShow}>
                <FontAwesomeIcon icon={faTrash} color={'grey'}/>
            </Button> : undefined
        return (
            <>
                <Modal show={this.state.showDeleteConfirm} onHide={this.handleClose} size={'lg'}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete this honk?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{whiteSpace: 'pre-line'}}>{this.state.content}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.deletePost} variant={'danger'}>Delete</Button>
                    </Modal.Footer>
                </Modal>
                <Container className='Tweet'>
                    <Row>
                        <Col md='auto'>
                            <img className='user_thumbnail'
                                 src='https://image.shutterstock.com/z/stock-vector-profile-blank-icon-empty-photo-of-male-gray-person-picture-isolated-on-white-background-good-535853269.jpg'
                                 alt={this.state.username}/>
                        </Col>
                        <Col>
                            <div className='tweet_username'>
                                <LinkContainer className='profileLink'
                                               to={'/' + this.state.username}><Nav.Link>{this.state.username}</Nav.Link></LinkContainer>
                            </div>
                            <div className='tweet_time'>
                                <span>{this.convertTs(this.state.time)}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div className='tweet_content'>
                            {this.createMentionLinks()}
                        </div>
                    </Row>
                    <Row className='postActionRow'>
                        <div className='postActionPanel'>
                            <Likes likes={this.state.likes} id={this.state.id}/>
                            <Button variant={'outline-*'}>
                                <FontAwesomeIcon icon={faReply} color={'grey'}/>
                            </Button>
                            {deleteButton}
                        </div>
                    </Row>
                </Container>
            </>
        );
    }

    convertTs = (ts) => {
        var date = new Date(Math.round(ts * 1000));
        return date.toLocaleString();
    }

    createMentionLinks = (text) => {
        const regexp = RegExp('@([a-zd_[0-9]+)', 'gi')
        const str = this.state.content
        let matches = str.matchAll(regexp)
        var components = []
        var lastMentionEndIndex = 0

        for (let match of matches) {
            components.push(str.substring(lastMentionEndIndex, match.index))
            components.push(<LinkContainer className='profileLink' to={'/' + match[1]}
                                           key={match.index}><Nav.Link>{match[0]}</Nav.Link></LinkContainer>)
            lastMentionEndIndex = match.index + match[0].length
        }
        if (lastMentionEndIndex !== str.length)
            components.push(str.substring(lastMentionEndIndex))

        return <>{components}</>
    }

    deletePost = () => {
        const url = API + `/item/${this.state.id}`
        fetch(url, {
            method: "DELETE",
            credentials: "include"
        })
            .then(res => {
                if (res.status !== 200)
                    toast.error(res.error)
                else
                    this.props.deleteHandler(this.props.index)

            })
            .catch(err => {
                console.log(err)
            })
    }

    handleShow = () => this.setState({showDeleteConfirm: true})
    handleClose = () => this.setState({showDeleteConfirm: false})
}

toast.configure({
    autoClose: 3000,
    draggable: false,
    position: toast.POSITION.BOTTOM_RIGHT
})


export default Tweet;
