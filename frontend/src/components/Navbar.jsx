import React, { Component } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
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
    if(this.props.location.pathname !== prevProps.location.pathname){
      this.setState({ isAuthenticated: this.isAuthenticated() });
    }
  }

  render() {
    if(this.state.isAuthenticated) console.log('Authenticated')
    else console.log('Not Authenticated')
    
    return (
      <Navbar
        bg="light"
        expand="lg"
        onSelect= {() => {console.log('Clicked Navbar')}}
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

  isAuthenticated = () => {
    return Cookies.get('authToken') ? true : false;
  }
}



export default withRouter(NavBar);
