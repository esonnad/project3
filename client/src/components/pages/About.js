import React, { Component } from 'react'
const pictures = ["../../images/pic1.jpg", "../../images/pic2.jpg", "../../images/pic3.JPG", "../../images/pic4.JPG", "../../images/pic5.JPG", "../../images/pic6.JPG", "../../images/pic7.JPG", "../../images/pic8.JPG", "../../images/pic9.JPG", "../../images/pic10.JPG", "../../images/pic11.JPG", "../../images/pic12.JPG", "../../images/pic13.JPG", "../../images/pic14.JPG", "../../images/pic15.JPG", "../../images/pic16.JPG", "../../images/pic17.JPG", "../../images/pic18.JPG", "../../images/pic19.JPG", "../../images/pic20.JPG", "../../images/pic21.JPG", "../../images/pic22.JPG", "../../images/pic23.JPG", ]

export default class About extends Component {
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
          <h5 className="card-title">What is this... ??</h5>
          <p className="card-text">Yeah we get that, before you sign up for another random page you want to know what you are signing up for. So let us tell you!</p>
          <p className="card-text">First of all, we don't sell washing machines!</p><br></br>
          <p className="card-text">PinPoint is a website, where you can create Moments, Questions, Tips and Warnings that you had in specific places. If you want to, you can post them private, for your own memory, or you can even post it public. On the Explore page, explore all posts that were ever created, no matter where in the world.</p><br></br>
          <p className="card-text">So let`s get started:</p>
          <a href="/signup" className="btn btn-primary">Sign up</a><br></br><br></br>
          <p className="card-text">Created by Emina and Feli</p>
          </div>
          
          </div>
      </div>
      </div>
    )
  }
}
