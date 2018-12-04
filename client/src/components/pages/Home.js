import React, { Component } from 'react';
const pictures = ["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&h=350", "https://static.makeuseof.com/wp-content/uploads/2018/03/travel-planning-apps-670x335.jpg", "https://s14677.pcdn.co/wp-content/uploads/2015/06/Best-Travel-Tips-Traveling-the-World.jpg", "https://triphunter.ro/wp-content/uploads/2014/04/calatoreste-2.jpg"]

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      background: ""
    }
  }
  componentDidMount(){
    var randomPicture = Math.floor(Math.random()*pictures.length)
    this.setState({
      background: pictures[randomPicture]
    })
  }
  render() {                
    return (
      <div className="Home" style={{backgroundImage: `url(${this.state.background})`}}>
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
