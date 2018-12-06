import React, { Component } from 'react';
import api from '../../api';
const pictures = ["../../images/pic1.jpg", "../../images/pic2.jpg", "../../images/pic3.JPG", "../../images/pic4.JPG", "../../images/pic5.JPG", "../../images/pic6.JPG", "../../images/pic7.JPG", "../../images/pic8.JPG", "../../images/pic9.JPG", "../../images/pic10.JPG", "../../images/pic11.JPG", "../../images/pic12.JPG", "../../images/pic13.JPG", "../../images/pic14.JPG", "../../images/pic15.JPG", "../../images/pic16.JPG", "../../images/pic17.JPG", "../../images/pic18.JPG", "../../images/pic19.JPG", "../../images/pic20.JPG", "../../images/pic21.JPG", "../../images/pic22.JPG", "../../images/pic23.JPG", ]

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      email: "",
      password: "",
      message: null,
      background: ""
    }
  }

  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    })
  }

  componentDidMount(){
    var randomPicture = Math.floor(Math.random()*pictures.length)
    this.setState({
      background: pictures[randomPicture]
    })
  }

  handleClick(e) {
    e.preventDefault()
    let data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    }
    api.signup(data)
      .then(result => {
        console.log('SUCCESS!', result)
        this.props.getUser(result)
        //this.props.history.push("/") // Redirect to the home page

      })
      .catch(err => this.setState({ message: err.toString() }))
  }

  render() {
    return (
      <div className="Home" style={{backgroundImage: `url(${this.state.background})`}}>
      <div className="feli">
          <div className="card text-center w-50">
          
          <div className="card-body">
          <h5 className="card-title">Signup</h5>
          <p className="card-text"><form>
          Username: <input type="text" value={this.state.username} onChange={(e) => this.handleInputChange("username", e)} /> <br />
          Email: <input type="text" value={this.state.email} onChange={(e) => this.handleInputChange("email", e)} /> <br />
          Password: <input type="password" value={this.state.password} onChange={(e) => this.handleInputChange("password", e)} /> <br /><br />
          <button className="btn btn-primary btn-shadow" onClick={(e) => this.handleClick(e)}>Signup</button>
          </form></p>
          <p>{this.state.message && <div className="info info-danger">
          {this.state.message}
          </div>}</p>
          </div>
          
          </div>
      </div>
      </div>
    );
  }
}

export default Signup;
