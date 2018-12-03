import React, { Component } from 'react';

class Home extends Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }
  render() {                
    return (
      <div className="Home">
      <div className="feli">
        <div className="card text-center w-50">
          
          <div className="card-body">
          <h5 className="card-title">Welcome</h5>
          <p className="card-text">Text that tells you about the project</p>
          <a href="/signup" className="btn btn-primary">Sign up</a>
          <a href="/login" className="btn btn-primary">Log in</a>
          </div>
          
          </div>
      </div>
      </div>
    );
  }
}

export default Home;
