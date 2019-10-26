import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

class NavBar extends Component {
  render() {
    return (
      <Navbar
        bg="light"
        expand="lg"
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

    </Navbar>
    );
  }
}

export default NavBar;
