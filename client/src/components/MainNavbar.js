import React, { Component } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { NavLink as NLink, Link } from 'react-router-dom' // Be careful, NavLink is already exported from 'reactstrap'
import logo from '../logo.svg';
import api from '../api';


export default class MainNavbar extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      user: null,
      isOpen: false
    };
  }

  componentDidMount() {
    this.getUser();
  }
  getUser =() =>{
    api.getUser()
    .then(user => {
      this.setState({
        user: user
      })
      console.log(this.state.user._id)
    })
  }


  handleLogoutClick=(e)=> {
    api.logout()
    .then(result => {
      this.props.getUser(null)})
      // this.props.history.push("/");
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <Navbar dark expand="md" className="MainNavbar">
        <NavbarBrand to="/" tag={Link}>
          <img src="../logoPin.png" className="logo" alt="logo" />
          
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>

            {!api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/">Home</NavLink>
            </NavItem>}
            {!api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/signup">Signup</NavLink>
            </NavItem>}
            {!api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/login">Login</NavLink>
            </NavItem>}
            {!api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/about">What?</NavLink>
            </NavItem>}
            {api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/explore">Explore</NavLink>
            </NavItem>}
            {api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/private">My Spots</NavLink>
            </NavItem>}
            {api.isLoggedIn() && <NavItem>
              <NavLink tag={NLink} to="/add-post">Add your post</NavLink>
            </NavItem>}
            {(api.isLoggedIn() && this.state.user!= null) && <NavItem>
              <NavLink tag={NLink} to={`/viewprofile/${this.state.user._id}`}>Profile</NavLink>
            </NavItem>}
           

          </Nav>              {api.isLoggedIn() && <NavLink tag={Link} to="/home" onClick={ this.handleLogoutClick}>Logout</NavLink> }

        </Collapse>
      </Navbar>
    )
  }
}