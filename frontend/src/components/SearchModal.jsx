import React, { Component } from 'react';
import { Button, Container, Form, Col, Modal, Nav } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { withRouter } from 'react-router-dom';
import API from '../constants'
import "react-datepicker/dist/react-datepicker.css";

const payloadParams = ['timestamp', 'limit', 'q', 'username', 'following']

class SearchModal extends Component {

    state = {
        showModal: false,
        following: null,
        q: null,
        username: null,
        limit: null,
        timestamp: null
    }


    render() {
        return (
            <>
                <Nav.Link onClick={this.handleShow}>Search</Nav.Link>
                <Modal show={this.state.showModal} onHide={this.handleClose} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Search</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId='q' onChange={this.handleChange}>
                                <Form.Label>Keywords</Form.Label>
                                <Form.Control type='text' placeholder='Get posts with text that match these keywords' />
                            </Form.Group>
                            <Form.Group controlId='username' onChange={this.handleChange}>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='text' placeholder='Get posts submitted by this user' />
                            </Form.Group>
                            <Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId='limit' className='limitControl' onChange={this.handleChange}>
                                        <Form.Label>Max Posts To Show</Form.Label>
                                        <Form.Control type='number' defaultValue={50} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId='timestamp'>
                                        <Form.Label>Posted before:</Form.Label><br />
                                        <DatePicker
                                            selected={this.state.timestamp}
                                            onChange={this.setDate}
                                            showTimeSelect
                                            timeIntervals={60}
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            customInput={<Form.Control />}
                                        />
                                    </Form.Group>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group controlId="following" onChange={this.handleChange}>
                                <Form.Check type="checkbox" label="Only show posts by people I follow" defaultChecked/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Search
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    handleShow = () => this.setState({ showModal: true })
    handleClose = () => this.setState({ showModal: false, timestamp: null })
    setDate = (date) => this.setState({ timestamp: date })

    handleChange = e => {
        switch (e.target.type) {
            case 'text':
                this.setState({ [e.target.id]: e.target.value })
                break
            case 'number':
                this.setState({ [e.target.id]: e.target.valueAsNumber })
                break
            case 'checkbox':
                this.setState({ [e.target.id]: e.target.checked })
                break
            default:
                break

        }
    };


    handleSubmit = e => {
        e.preventDefault();
        const { history } = this.props
        const url = API + '/search'
        var payload = {}
        for (let s in this.state) {
            if (this.state[s] != null && payloadParams.includes(s))
                payload[s] = this.state[s]
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(response => {
                this.setState({ showModal: false })
                this.props.history.push({
                    pathname: '/search',
                    state: { posts: response.items }
                });

            })
    }
}


export default withRouter(SearchModal);
