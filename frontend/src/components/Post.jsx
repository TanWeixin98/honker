import React, {Component} from  'react';
import {Form, Button, Container} from 'react-bootstrap';

class Post extends Component{
  state = {
    content: ""
  }
  render() {
    return(
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control as="textarea" rows="3" onChange = {this.handleChange}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Button type = "submit">Post</Button>
          </Form.Group>
        </Form>
      </Container>
    ); 
  }

  handleChange = e =>{
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  handleSubmit = e =>{
    e.preventDefault();
    const url = "http://honker.cse356.compas.cs.stonybrook.edu/additem"
    fetch(url, {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {"Content-Type": "application/json"}
    })
      .then( res => res.json())
      .then(response => {
         if(response.status === "OK"){
            alert("Item ID: " + response.id);
         }else{
            alert(response.error);
         }
      });
  }

}


export default Post;
