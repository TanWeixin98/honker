import React, { Component } from "react";
import { Form, Container, Button, Row, Alert } from "react-bootstrap"

class Verify extends Component {

    state = {
        error: '',
        email: '',
        key: ''
    }
    render() {
        let errorAlert;
        if (this.state.error.length > 0)
            errorAlert = <Alert variant="danger">{this.state.error}</Alert>;

        return (
            <Container style={{ textAlign: 'center' }}>
                {errorAlert}
                <h1 className="mb-3 unselectable">Verify your email</h1>
                <Row className="justify-content-md-center">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                autoComplete='email'
                                placeholder="Enter Email"
                                onChange={this.handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="key">
                            <Form.Label>Key</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Key"
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className='justify-content-md-center' id='VerifyButton'>
                            Verify
                        </Button>
                    </Form>
                </Row>
            </Container>
        );
    }

    handleChange = e => {
        e.preventDefault();
        this.setState({ [e.target.id]: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();

        var data = {
            email: this.state.email,
            key: this.state.key
        };
        const url = "http://honker.cse356.compas.cs.stonybrook.edu/verify"

        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.status + "\n" + response.msg);
                if (!response.error)
                        this.props.history.push('/');
                else if (response.error)
                    this.setState({ error: response.error })
            })
            .catch(error => console.error(error));
    };
}

export default Verify;
