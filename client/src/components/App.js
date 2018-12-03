import React, { Component } from 'react';
import { Route, Link, NavLink, Switch, Redirect } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AddPost from './pages/AddPost';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Private from './pages/Private';
import Profile from './pages/Profile';
import Verification from './pages/Verification';
import ProtectedRoute from './pages/Protected';

import EditPost from './pages/EditPost';
import api from '../api';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedInUser: null
    }
    //api.loadUser();
  }

  getTheUser= (userObj) => {
    console.log("get the user", userObj)
    this.setState({
      loggedInUser: userObj
    })
  }

  handleLogoutClick(e) {
    api.logout()
  }

  render() {
    return (
      <div className="App">
        <MainNavbar getUser={this.getTheUser}/>
        <Switch>
          <Route path="/home"  component={Home} />
          <ProtectedRoute user={this.state.loggedInUser} path="/" exact component={Explore} />
          <Route path="/signup" render={() => this.state.loggedInUser ? (
    <Redirect to="/"/>
  ) : (
  <Signup getUser={this.getTheUser}/>)} />
          <Route path="/login" render={() => this.state.loggedInUser ? (
    <Redirect to="/"/>
  ) : (
  <Login getUser={this.getTheUser}/>)} />
          <Route path="/about" component={About} />

          <Route path="/explore" component={Explore} />
          <Route path="/posts/:id" component={EditPost}/>
          <Route path="/private" component={Private} />
          <ProtectedRoute user={this.state.loggedInUser} path="/add-post" component={AddPost} />
          <ProtectedRoute user={this.state.loggedInUser} path="/myProfile" component={Profile} />
          <Route path="/verifyemail/:id" component={Verification} />
          
          <Route render={() => <h2>404</h2>} />
        </Switch>
        <MainFooter />
      </div>
    );
  }
}

export default App;
