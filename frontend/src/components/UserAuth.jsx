import React, { Component } from "react"
import { Form, Container, Button, Row, Alert } from "react-bootstrap"

class userAuth extends Component {
    state = {
        email: "",
        pw: "",
        isRegister: false,
        registerText: "I need to create an account",
        header: "Log in",
        loggedIn: false,
        error: ""
    };

    constructor(props) {
        super(props);

        this._isMounted = false;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted= true;
    }

    render() {
        let errorAlert;
        if (this.state.error.length > 0)
            errorAlert = <Alert variant="danger">{this.state.error}</Alert>;

        return (
            <Container>
                {errorAlert}
                <h1 className="mb-3">{this.state.header}</h1>
                <Row className="justify-content-md-center">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                onChange={this.handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="pw">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <div onClick={this.handleSignInText} className="m-2" style={{cursor: "pointer"}}>
                            {this.state.registerText}
                        </div>
                    </Form>
                </Row>
            </Container>
        );
    }

    handleSignInText = () => {
        const isRegister = !this.state.isRegister;
        const registerText = isRegister
            ? "I already have an account"
            : "I need to create an account";
        const header = isRegister ? "Sign up" : "Log in";
        this.setState({ isRegister, registerText, header });
    };

    handleChange = e => {
        e.preventDefault();
        this.setState({ [e.target.id]: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        if (!this.validateForm()) return;
        const data = JSON.stringify({
            email: this.state.email,
            pw: this.state.pw
        });
        const url = "http://honker.cse356.compas.cs.stonybrook.edu/"
            + (this.state.isRegister ? "/create_user" : "/login");
        //console.log(this.props);
        fetch(url, {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(response => {
                console.log(response.success + "\n" + response.message);
                if (response.success) {
                    this.props.onLogin(this.state.email);
                    if (this.state.isRegister) this.props.history.push("/user/account/type");
                    else if (this._isMounted && !this.state.isRegister) {
                        this.setState({ loggedIn: true });
                    }
                } else if (!response.success && this._isMounted) {
                    this.setState({error: response.message});
                }
            })
            .catch(error => console.error(error));
    };

    validateForm() {
        let isValid = true;
        if (this.state.email.length === 0) {
            isValid = false;
        }
        if (this.state.pw.length === 0) {
            isValid = false;
        }
        return isValid;
    }
}

export default userAuth