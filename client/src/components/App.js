import React, { Component } from 'react';
import { Route, Link, NavLink, Switch } from 'react-router-dom';
import MainNavbar from './MainNavbar';
import Home from './pages/Home';
import Posts from './pages/Posts';
import AddPost from './pages/AddPost';
import Secret from './pages/Secret';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
          <Route path="/posts" component={Posts} />
          <Route path="/add-post" component={AddPost} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/secret" component={Secret} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}

export default App;
