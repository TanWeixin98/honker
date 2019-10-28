import React, { Component } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <Navbar
        bg="light"
        expand="lg"
        onSelect= {() => {console.log('asdasd123')}}
        style={{
          position: "relative",
          top: "50%"
        }}
      >
        <LinkContainer to='/'>
          <Navbar.Brand>Honker</Navbar.Brand>
        </LinkContainer>
        <LinkContainer to='/login'>
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
        <Button onClick={this.handleLogout}>Logout</Button>


      </Navbar>
    );
  }

  handleLogout = (e) => {
    const {history} = this.props;
    const url = "http://honker.cse356.compas.cs.stonybrook.edu/logout"
    fetch(url, {
      method: "POST",
      credentials: 'include'
    })
      .then(res => res.json())
      .then(() => {
        history.push('/');
        alert('You have logged out')
      })
      .catch(error => console.error(error));
  }
}



export default withRouter(NavBar);
