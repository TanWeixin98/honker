import React, { Component } from "react";
import { Navbar, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import API from "../constants";
import SearchModal from './SearchModal'

class NavBar extends Component {
  state = {
    isAuthenticated: false,
    showSearch: false
  };

  constructor(props) {
    super(props);
    this.state.isAuthenticated = this.isAuthenticated();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname)
      this.setState({ isAuthenticated: this.isAuthenticated() });
  }

  render() {
    var loginButton, userDropdown, searchModal;
    if (this.state.isAuthenticated) {
      loginButton = undefined;
      userDropdown = this.userDropdown;
    }
    else {
      loginButton = <LinkContainer to='/login'><Nav.Link>Login</Nav.Link></LinkContainer>;
      userDropdown = undefined;
    }
    if(this.state.showSearch){
      searchModal = <SearchModal/>
    }

    return (
      <>
      {searchModal}
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
        <SearchModal/>
        <LinkContainer to='/byid'>
          <Nav.Link>ByID</Nav.Link>
        </LinkContainer>

        <Navbar.Collapse className="justify-content-end">
          {loginButton}
          {userDropdown}
        </Navbar.Collapse>
      </Navbar>
      </>
    );
  }

  userDropdown = (
    <DropdownButton id="userDropdown" title="My Account" size="sm" alignRight>
      <Dropdown.Item as="button" onClick={e => this.navigateToProfile(e)}>My Profile</Dropdown.Item>
      <Dropdown.Item as="button" onClick={e => this.handleLogout(e)}>Logout</Dropdown.Item>
    </DropdownButton>
  )

  handleLogout = (e) => {
    e.preventDefault()
    const { history } = this.props;
    const url = API + "/logout"
    fetch(url, {
      method: "POST",
      credentials: 'include'
    })
      .then(response => response.json())
      .then(res => {
        if (res.status === 'OK')
          alert('You have logged out')
        else
          alert(res.error)
        this.setState({ isAuthenticated: false })
        history.push('/')
      })
      .catch(error => console.error(error))
  }

  navigateToProfile = (e) => {
    e.preventDefault(e)
    const { history } = this.props;
    const url = API + '/currentUser'
    fetch(url, { credentials: 'include' })
      .then(response => response.json())
      .then(res => {
        if (res.username !== null)
          history.push('/' + res.username)
        else
          history.push('/login')
      })
      .catch(error => console.error(error))
  }

  isAuthenticated = () => {
    return Cookies.get('authToken') ? true : false;
  }
}



export default withRouter(NavBar);
