import React, { Component } from "react";
import { Navbar, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import API from "../constants";
import SearchModal from './SearchModal'
import PostItem from "./PostItem";
import {toast} from "react-toastify";

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
    var addUserButton, loginButton, userDropdown, searchModal;
    if (this.state.isAuthenticated) {
      addUserButton = undefined;
      loginButton = undefined;
      userDropdown = this.userDropdown;
    }
    else {
      addUserButton = <LinkContainer to='/addUser'><Nav.Link>Register</Nav.Link></LinkContainer>
      loginButton = <LinkContainer to='/login'><Nav.Link>Login</Nav.Link></LinkContainer>;
      userDropdown = undefined;
    }
    if(this.state.showSearch){
      searchModal = <SearchModal/>
    }

    return (
      
      <Navbar
        bg="light"
        expand="lg"
        sticky="top"
      >
        <LinkContainer to='/'>
          <Navbar.Brand>Honker</Navbar.Brand>
        </LinkContainer>
        <PostItem/>
        <SearchModal/>
        <LinkContainer to='/byid'>
          <Nav.Link>ByID</Nav.Link>
        </LinkContainer>

        <Navbar.Collapse className="justify-content-end">
          {addUserButton}
          {loginButton}
          {userDropdown}
        </Navbar.Collapse>
        {searchModal}
      </Navbar>
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
          toast.success('You have logged out')
        else
          toast.error(res.error)
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
