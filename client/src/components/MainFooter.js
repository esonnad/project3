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


export default class MainFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render() {
    return (
      <Navbar color="primary" dark expand="md" className="MainNavbar">
          <Nav className="ml-auto" navbar>
            {<NavItem>
              <NavLink tag={NLink} to="/about">What?</NavLink>
            </NavItem>}
          </Nav>
        
      </Navbar>
    )
  }
}

