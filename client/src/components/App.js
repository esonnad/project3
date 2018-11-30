import React, { Component } from 'react';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import Home from './pages/Home';
import Posts from './pages/Posts';
import AddPost from './pages/AddPost';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Private from './pages/Private';
import Profile from './pages/Profile';
import Verification from './pages/Verification';
import api from '../api';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      countries: []
    }
    // api.loadUser();
  }

  handleLogoutClick(e) {
    api.logout()
  }

  render() {
    return (
      <div className="App">
        <MainNavbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/about" component={About} />

          <Route path="/posts" component={Posts} />
          <Route path="/private" component={Private} />
          <Route path="/add-post" component={AddPost} />
          <Route path="/myProfile" component={Profile} />
          <Route path="/verifyemail/:id" component={Verification} />
          
          <Route render={() => <h2>404</h2>} />
        </Switch>
        <MainFooter />
      </div>
    );
  }
}

export default App;
