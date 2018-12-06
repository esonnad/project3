import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import api from '../../api';
const pictures = ["../../images/pic1.jpg", "../../images/pic2.jpg", "../../images/pic3.JPG", "../../images/pic4.JPG", "../../images/pic5.JPG", "../../images/pic6.JPG", "../../images/pic7.JPG", "../../images/pic8.JPG", "../../images/pic9.JPG", "../../images/pic10.JPG", "../../images/pic11.JPG", "../../images/pic12.JPG", "../../images/pic13.JPG", "../../images/pic14.JPG", "../../images/pic15.JPG", "../../images/pic16.JPG", "../../images/pic17.JPG", "../../images/pic18.JPG", "../../images/pic19.JPG", "../../images/pic20.JPG", "../../images/pic21.JPG", "../../images/pic22.JPG", "../../images/pic23.JPG", ]


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      message: null,
      background: ""
    }
  }

  componentDidMount(){
    var randomPicture = Math.floor(Math.random()*pictures.length)
    this.setState({
      background: pictures[randomPicture]
    })
  }

  handleInputChange(stateFieldName, event) {
    this.setState({
      [stateFieldName]: event.target.value
    })
  }

  handleClick(e) {
    e.preventDefault()
    api.login(this.state.username, this.state.password)
      .then(result => {
        this.props.getUser(result)
        //this.props.history.push("/explore") // Redirect to the explore page
      })
      .catch(err => this.setState({ message: err.toString() }))
  }

  render() {
    return (
      <div className="Home" style={{backgroundImage: `url(${this.state.background})`}}>
      <div className="feli">
          <div className="card text-center w-50">
          
          <div className="card-body">
          <h5 className="card-title">Login</h5>
          <p className="card-text"><form>
            Username: <input type="text" value={this.state.username} onChange={(e) => this.handleInputChange("username", e)} /> <br />
            Password: <input type="password" value={this.state.password} onChange={(e) => this.handleInputChange("password", e)} /> <br /><br/>
            <button className="btn btn-primary btn-shadow" onClick={(e) => this.handleClick(e)}>Login</button>
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

export default Login;
