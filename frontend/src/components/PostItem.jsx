import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import API from '../constants'

class PostItem extends Component {
  state = {
    content: "",
    progress: 0,
    showProgress: false
  }
  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control as="textarea" rows="3" onChange={this.handleChange} />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Button type="submit">Post</Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const url = API + '/additem'
    fetch(url, {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify({content: this.state.content}),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(response => {
        if (response.status === "OK") {
          this.props.handleRefresh()
          //alert("Item ID: " + response.id);
        }
        else {
          alert(response.error);
        }
      });
  }

}


export default PostItem;
