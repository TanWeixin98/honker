import React, {Component} from 'react';
import {Form, FormGroup, InputGroup, Modal, Button} from "react-bootstrap";
import TweetSnippet from "./TweetSnippet";
import API from "../constants";
import {toast} from 'react-toastify';

// This component is used for both retweeting AND replying
class Rehonk extends Component {

    state = {
        showModal: true,
        type: 'Rehonk',
        comment: ''
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState, showModal: nextProps.show, type: nextProps.isRehonk ? 'Rehonk' : 'Reply'
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.closeHandler} size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.type}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TweetSnippet
                        id={this.props.id}
                        username={this.props.username}
                        time={this.props.time}
                        content={this.props.content}/>
                </Modal.Body>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <InputGroup as={'textarea'} placeholder={'Your comment'} onChange={this.handleChange} value={this.state.comment}/>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit}
                            disabled={this.state.comment.trim().length === 0}>{this.state.type}</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    handleChange = e => {
        e.preventDefault()
        this.setState({comment: e.target.value})
    }

    onSubmit = e => {
        e.preventDefault()
        const url = API + '/additem'
        var payload = {
            content: this.state.comment,
            childType: this.props.isRehonk ? 'retweet' : 'reply',
            parent: this.props.id
        }
        fetch(url, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(payload),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === "OK") {
                    this.setState({comment:''})
                    toast.success('Your honk was submitted!')
                    if(this.props.isRehonk) this.props.successHandler()
                    this.props.closeHandler()
                } else {
                    toast.error(response.error)
                }
            });
    }
}

export default Rehonk;