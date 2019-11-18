import React, {Component} from 'react';
import {Form, Button, Modal, Nav} from 'react-bootstrap';
import API from '../constants'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class PostItem extends Component {
    state = {
        content: "",
        progress: 0,
        showProgress: false,
        showModal: false
    }

    render() {
        return (
            <>
                <Nav.Link onClick={this.handleShow}>Honk</Nav.Link>
                <Modal
                    show={this.state.showModal}
                    onHide={this.handleClose}
                    onEntered={() => document.getElementById("content").focus()} // Workaround since autoFocus didnt work :(
                    size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Honk</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="content">
                                <Form.Control as="textarea" rows="3"
                                              onChange={this.handleChange}
                                              placeholder="What do you want to honk about?">
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Form.Control as="textarea" rows="3"
                                  onChange={this.handleChange}
                                  placeholder="What do you want to honk about?">
                    </Form.Control>
                    <Modal.Footer>
                        <Button onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    handleShow = () => this.setState({showModal: true})
    handleClose = () => this.setState({showModal: false})

    handleChange = e => {
        e.preventDefault();
        this.setState({[e.target.id]: e.target.value});
    }

    handleSubmit = e => {
        e.preventDefault();
        const url = API + '/additem'
        fetch(url, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({content: this.state.content}),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === "OK") {
                    toast.success('Your honk was submitted!')
                    this.setState({ showModal: false })
                } else {
                    toast.error(response.error)
                }
            });
    }

}

toast.configure({
    autoClose: 3000,
    draggable: false,
    position: toast.POSITION.BOTTOM_RIGHT
})


export default PostItem;
