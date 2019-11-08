import React, { Component } from "react";
import { Navbar, Nav, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

class NavBar extends Component {
  state = {
    isAuthenticated: false
  };

  constructor(props){
    super(props);
    this.state.isAuthenticated = this.isAuthenticated();
  }

  componentDidUpdate(prevProps){
    if(this.props.location.pathname !== prevProps.location.pathname)
      this.setState({ isAuthenticated: this.isAuthenticated() });
  }

  render() {
    var loginButton, userDropdown;
    if(this.state.isAuthenticated){
      loginButton = undefined;
      userDropdown = this.userDropdown;
    }
    else{
      loginButton = <LinkContainer to='/login'><Nav.Link>Login</Nav.Link></LinkContainer>;
      userDropdown = undefined;
    }

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
        <LinkContainer to='/post'>
          <Nav.Link>Post Item</Nav.Link>
        </LinkContainer>
        <LinkContainer to='/search'>
          <Nav.Link>Search Items</Nav.Link>
        </LinkContainer>
        <LinkContainer to='/byid'>
          <Nav.Link>ByID</Nav.Link>
        </LinkContainer>
        
        {loginButton}
        {userDropdown}
        
      </Navbar>
    );
  }

  userDropdown = (
    <DropdownButton id="userDropdown" title="My Account" size="sm">
      <Dropdown.Item href="#/action-1">My Profile</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleLogout(e)}>Logout</Dropdown.Item>
    </DropdownButton>
  )

  handleLogout = (e) => {
    e.preventDefault()
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
        this.setState({ isAuthenticated: false });
      })
      .catch(error => console.error(error));
  }

  isAuthenticated = () => {
    return Cookies.get('authToken') ? true : false;
  }
}



export default withRouter(NavBar);
