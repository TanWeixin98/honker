import React, {Component} from  'react';
import {Button, Container, Form, Col} from 'react-bootstrap';

class SearchPopup extends Component{

    state = {
      following: false
    }

    render() {
      return( 
          <div className = 'popup'>
              <div className='popup_inner' style={{ textAlign: 'center' }}>
                  <h1>SEARCH</h1>
                  <Container>
                      <Form onSubmit={this.handleSubmit}>
                          <Form.Group controlId = 'query'>
                              <Form.Label>Search</Form.Label>
                              <Form.Control
                                  type = "text"
                                  placeholder = "Keywords"
                                  onChange = {this.handleChange}
                              />
                          </Form.Group>
                          <Form.Group controlId = 'username'>
                              <Form.Label>Username</Form.Label>
                              <Form.Control
                                  type = "text"
                                  placeholder = "Username"
                                  onChange = {this.handleChange}
                              />
                          </Form.Group>
                          <Form.Row>
                              <Form.Group as={Col} controlId = 'limit'>
                                  <Form.Label>Limit</Form.Label>
                                  <Form.Control
                                      type = "number"
                                      placeholder = "Limit"
                                      onChange = {this.handleChange}
                                  />
                              </Form.Group>
                              <Form.Group controlId = 'timestamp'>
                                  <Form.Label>Timestamp</Form.Label>
                                  <Form.Control
                                      type = "number"
                                      placehoder = "timestamp"
                                      onChange = {this.handleChange}
                                  />
                              </Form.Group>
                              <Form.Group controlId = 'following'>
                                  <Form.Check 
                                      type="checkbox" 
                                      label="Following"
                                      onChange = {this.handleCheck}
                              />
                              </Form.Group>
                          </Form.Row>
                          <Button variant="primary" type="submit" className='justify-content-md-center'>Search</Button>
                          <Button>Cancle</Button>
                      </Form>
                  </Container>
              </div>
          </div>
      );
    }

    handleChange = e => {
        e.preventDefault();
        this.setState({ [e.target.id]: e.target.value });
    };

    handleCheck = e =>{
        e.preventDefault();
        this.setState({[e.target.id]: !this.state[e.target.id]});
    }

    handleSubmit = e => {
        e.preventDefault();
        const url = "http://honker.cse356.compas.cs.stonybrook.edu/search"

        fetch(url,{
                method : "POST",
                body : JSON.stringify(this.state),
                headers:{
                    "Content-Type": "application/json"
                }
        })
            .then( res =>  res.json())
            .then( response => {
                this.props.history.push({
                  pathname: '/tweets',
                  state: { tweets: response.items }
                });
            
            })
    }
}


export default SearchPopup;
