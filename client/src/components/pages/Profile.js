import React, { Component } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import { Server } from 'https';
import api from '../../api'

export default class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      username : "",
      email : "",
      imageURL: "",
      oldPassword : "",
      newPassword : "",
      confirmNewPassword : "",
      message:null,
      imageFile: null
    }
  }
  handleChange =(event)=>{
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  componentDidMount() {
    this.getUser();
  }
  getUser =() =>{
    api.getUser()
    .then(user => {
      this.setState({
        username :user.username,
        email : user.email,
        imageURL : user.imageURL
      })
    })
  }

  handleUserEmailChange(e){
    e.preventDefault()
    let data = {
      username : this.state.username,
      email: this.state.email
    }
    api.updateUsernameEmail(data)
      .then(result => {
        this.setState({
          message: `Your information was updated`
        })
      setTimeout(() => {
        this.setState({
          message: null
        })
      }, 2000)
    })
      .catch(err => this.setState({ message: err.toString() }))
  }

  handlePasswordChange(e){
    e.preventDefault()
    let data = {
      oldPassword : this.state.oldPassword,
      newPassword : this.state.newPassword,
      confirmNewPassword : this.state.confirmNewPassword
    }
    api.changePassword(data)
      .then(result => {
        this.setState({
          oldPassword : "",
          newPassword : "",
          confirmNewPassword : "",
           message: `Your password was updated`
        })
      setTimeout(() => {
        this.setState({
          message: null
        })
      }, 2000)
    })
      .catch(err => this.setState({ message: err.toString() }))
  }

  handleFileChange=(e)=> {
   e.preventDefault()
    this.setState({
      imageFile: e.target.files[0]
    })
  }

  handleFileSubmit(e) {
    e.preventDefault()
    this.setState({
      imageURL: "",
      message: "Image loading..."
    })
    api.addPicture(this.state.imageFile)
    .then(data => {
      this.setState({
        imageURL: data.imageURL,
        message: null
      })
    })
  }

  render() {
    return (
      <div className="Home" style={{backgroundImage: `url(${"../map.jpg"})`}}>
      <h1 className="page-title">Edit my Profile</h1>
      <div className="feliProfile">

          <div className="card text-center w-50">
          <div className="card-body">

          <h5 className="card-title">Edit Username and Email</h5>
          <p className="card-text"><form>
          <Label for="username">Username:</Label>
          <Input type="text" value={this.state.username} name="username" onChange={this.handleChange} />
          <Label for="email">Email:</Label>
          <Input type="text" value={this.state.email} name="email" onChange={this.handleChange} />
          <button className="btn btn-primary btn-shadow" onClick={(e) => this.handleUserEmailChange(e)}>Update</button>
          </form></p>
          <h5 className="card-title">Edit your Password</h5>
          <p className="card-text"><form>
          <Label for="oldPassword">Old Password:</Label>
          <Input type="password" value={this.state.oldPassword} name="oldPassword" onChange={this.handleChange} />
          <Label for="newPassword">New Password:</Label>
          <Input type="password" value={this.state.newPassword} name="newPassword" onChange={this.handleChange} />
          <Label for="confirmNewPassword">Confirm New Password:</Label>
          <Input type="password" value={this.state.confirmNewPassword} name="confirmNewPassword" onChange={this.handleChange} />
          <button className="btn btn-primary btn-shadow" onClick={(e) => this.handlePasswordChange(e)}>Change</button>
        </form></p>

          </div>
          </div>

          
          {this.state.message && <div className="info">
            {this.state.message}
          </div>}
     

          <div className="card text-center w-50">
          <div className="card-body">

          <h5 className="card-title">Edit your profile Picture</h5>
          {this.state.imageURL!=="" && <img src={this.state.imageURL} style={{height: 200}} />}

          <p className="card-text"><form onSubmit={(e)=>this.handleFileSubmit(e)}>
          <input type="file" onChange={this.handleFileChange} /> <br/>
          <button className="btn btn-primary btn-shadow" type="submit">Save new profile picture</button>
          </form></p>

          </div>
          </div>
      </div>
      </div>
    )
  }
}
