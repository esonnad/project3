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
        console.log('SUCCESS!')
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
        console.log('SUCCESS!')
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
      <div>
        <h2>Here you can edit the details of your profile!</h2>

        {this.state.imageURL!=="" && <img src={this.state.imageURL} style={{height: 200}} />}

        <form onSubmit={(e)=>this.handleFileSubmit(e)}>
          <input type="file" onChange={this.handleFileChange} /> <br/>
          <button type="submit">Save new profile picture</button>
        </form>
        <form>
          <Label for="username">Username:</Label>
          <Input type="text" value={this.state.username} name="username" onChange={this.handleChange} />
          <Label for="email">Email:</Label>
          <Input type="text" value={this.state.email} name="email" onChange={this.handleChange} />
          <button onClick={(e) => this.handleUserEmailChange(e)}>Update</button>
        </form>
        {this.state.message && <div className="info">
          {this.state.message}
        </div>}
        <form>
          <Label for="oldPassword">Old Password:</Label>
          <Input type="password" value={this.state.oldPassword} name="oldPassword" onChange={this.handleChange} />
          <Label for="newPassword">New Password:</Label>
          <Input type="password" value={this.state.newPassword} name="newPassword" onChange={this.handleChange} />
          <Label for="confirmNewPassword">Confirm New Password:</Label>
          <Input type="password" value={this.state.confirmNewPassword} name="confirmNewPassword" onChange={this.handleChange} />
          <button onClick={(e) => this.handlePasswordChange(e)}>Change</button>
        </form>
      </div>
    )
  }
}
