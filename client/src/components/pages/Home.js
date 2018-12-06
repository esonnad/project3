import React, { Component } from 'react';
const pictures = ["../../images/pic1.jpg", "../../images/pic2.jpg", "../../images/pic3.JPG", "../../images/pic4.JPG", "../../images/pic5.JPG", "../../images/pic6.JPG", "../../images/pic7.JPG", "../../images/pic8.JPG", "../../images/pic9.JPG", "../../images/pic10.JPG", "../../images/pic11.JPG", "../../images/pic12.JPG", "../../images/pic13.JPG", "../../images/pic14.JPG", "../../images/pic15.JPG", "../../images/pic16.JPG", "../../images/pic17.JPG", "../../images/pic18.JPG", "../../images/pic19.JPG", "../../images/pic20.JPG", "../../images/pic21.JPG", "../../images/pic22.JPG", "../../images/pic23.JPG", ]

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
          <h5 className="card-title">Welcome to PinPoint!</h5>
          <p className="card-text">Happy to see you here!</p><br></br>
          <a href="/signup" className="btn btn-primary btn-shadow">Sign up</a><br></br><br></br>
          <a href="/login" className="btn btn-primary btn-shadow">Log in</a>
          </div>
          
          </div>
      </div>
      </div>
    );
  }
}

export default Home;
