import React, {Component} from 'react';
import {Container, Row, Col, Nav, Button, Modal} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import LikeButton from "./LikeButton";
import {toast} from 'react-toastify';
import './../css/tweet.css';
import API from "../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faReply, faTrash} from '@fortawesome/free-solid-svg-icons'
import Rehonk from "./Rehonk";
import TweetSnippet from "./TweetSnippet";
import RehonkButton from "./RehonkButton";

class Tweet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            time: this.convertTs(this.props.time),
            showDeleteConfirm: false,
            showRehonkModal: false,
            isRehonk: null,
            parentPost: null,
            timesRehonked: this.props.retweeted
        }
        if (this.props.type)
            this.getParent()
    }

    render() {
        const deleteButton = this.props.currentUser === this.props.username ?
            <Button size="sm" variant="outline-*" onClick={this.showDeleteModal}>
                <FontAwesomeIcon icon={faTrash} color={'grey'}/>
            </Button> : undefined
        let tweetType, tweetSnippet;
        if (this.props.type)
            tweetType = this.props.type === 'reply' ? 'replied' : 'retweeted'
        if (this.state.parentPost)
            tweetSnippet = <TweetSnippet username={this.state.parentPost.username} time={this.convertTs(this.state.parentPost.timestamp)} content={this.state.parentPost.content}/>
        return (
            <>
                <Rehonk isRehonk={this.state.isRehonk}
                        show={this.state.showRehonkModal}
                        username={this.props.username}
                        id={this.props.id} //This will be parent ID
                        content={this.props.content}
                        time={this.state.time}
                        successHandler={this.incrementRehonkCount}
                        closeHandler={this.hideRehonkModal}/>
                <Modal show={this.state.showDeleteConfirm} onHide={this.hideDeleteModal} size={'lg'}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to delete this honk?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{whiteSpace: 'pre-line'}}>{this.props.content}</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.deletePost} variant={'danger'}>Delete</Button>
                    </Modal.Footer>
                </Modal>
                <Container className='Tweet'>
                    <Row className={'profileRow'}>
                        <Col md='auto' className={'imageCol'}>
                            <img className='user_thumbnail'
                                 src='https://cdn4.vectorstock.com/i/thumbs/94/58/goose-head-icon-flat-style-vector-21879458.jpg'
                                 alt={this.props.username}/>
                        </Col>
                        <Col>
                            <div>
                                <LinkContainer className='profileLink'
                                               to={'/' + this.props.username}><Nav.Link>{this.props.username}</Nav.Link></LinkContainer>
                                <span className={'tweetType'}>&nbsp;&nbsp;{tweetType}</span>
                            </div>
                            <div className='tweet_time'>
                                <span>{this.state.time}</span>
                            </div>
                            {tweetSnippet}
                            <span className='tweet_content'>
                                {this.createMentionLinks()}
                            </span>
                            <Row className='postActionRow'>
                                <div className='postActionPanel'>
                                    <Button variant={'outline-*'} onClick={() => this.showRehonkModal(false)}>
                                        <FontAwesomeIcon icon={faReply} color={'grey'}/>
                                    </Button>
                                    <Button variant={'outline-*'} onClick={() => this.showRehonkModal(true)}>
                                        <RehonkButton timesRetweeted={this.state.timesRehonked}/>
                                    </Button>
                                    <LikeButton likes={this.props.likes} id={this.props.id}/>
                                    {deleteButton}
                                </div>
                            </Row>
                        </Col>
                    </Row>


                </Container>
            </>
        );
    }

    convertTs = (ts) => {
        var date = new Date(Math.round(ts * 1000));
        return date.toLocaleString();
    }

    createMentionLinks = () => {
        const regexp = RegExp('@([a-zd_[0-9]+)', 'gi')
        const str = this.props.content
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
        const url = API + `/item/${this.props.id}`
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

    getParent = () => {
        const url = API + `/item/${this.props.parent}`
        fetch(url, {
            method: "GET",
            credentials: "include"
        })
            .then(response => response.json())
            .then(res => {
                this.setState({parentPost: res.item})
            })
            .catch(err => {
                console.log(err)
            })
    }

    incrementRehonkCount = () => {
        this.setState(prevState => {
            return { timesRehonked: prevState + 1 }
        })
    }

    showDeleteModal = () => this.setState({showDeleteConfirm: true})
    hideDeleteModal = () => this.setState({showDeleteConfirm: false})
    showRehonkModal = (isRehonk) => this.setState({showRehonkModal: true, isRehonk: isRehonk})
    hideRehonkModal = (isRehonk) => this.setState({showRehonkModal: false, isRehonk: isRehonk})
}

toast.configure({
    autoClose: 3000,
    draggable: false,
    position: toast.POSITION.BOTTOM_RIGHT
})


export default Tweet;
