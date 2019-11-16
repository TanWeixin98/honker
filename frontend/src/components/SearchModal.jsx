import React, { Component } from 'react';
import { Button, Form, Col, Modal, Nav } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { withRouter } from 'react-router-dom';
import API from '../constants'
import "react-datepicker/dist/react-datepicker.css";

class SearchModal extends Component {

    state = {
        showModal: false,
        following: true,
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
                            <Form.Group controlId='q'>
                                <Form.Label>Keywords</Form.Label>
                                <Form.Control type='text' placeholder='Get posts with text that match these keywords' value={this.state.q ? this.state.q : ''} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group controlId='username'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control type='text' placeholder='Get posts submitted by this user' value={this.state.username ? this.state.username : ''} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col} controlId='limit'>
                                        <Form.Label>Max Posts To Show</Form.Label>
                                        <Form.Control type='number' value={this.state.limit != null ? this.state.limit : 50} onChange={this.handleChange} />
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
                            <Form.Group controlId="following">
                                <Form.Check type="checkbox" label="Only show posts by people I follow" checked={this.state.following} onChange={this.handleChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.clearSearchParams}>
                            Clear
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
    handleClose = () => this.setState({ showModal: false })
    setDate = (date) => this.setState({ timestamp: date })
    clearSearchParams = () => this.setState({
        following: true,
        q: null,
        username: null,
        limit: null,
        timestamp: null
    })

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
        const url = API + '/search'
        var payload = {}
        for (let s in this.state) {
            if (this.state[s] !== null && s !== 'showModal') {
                if (s === 'following' && this.state[s] === true)
                    continue
                else
                    payload[s] = this.state[s]
            }
        }
        if (payload.timestamp) payload.timestamp = payload.timestamp.getTime() / 1000

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
                this.handleClose()
                this.props.history.push({
                    pathname: '/search',
                    state: { posts: response.items, usage: 'Search Results', currentUser: response.currentUser }
                });

            })
    }
}


export default withRouter(SearchModal);
