import React, { Component } from 'react'
import { Server } from 'https';
import api from '../../api'
import { NavLink as NLink, Link } from 'react-router-dom'

export default class ViewProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: null,
      isMe: false,
    }
  }

  componentDidMount() {
    api.getUserByID(this.props.match.params.id)
    .then(user => {
      this.setState({
        user: user
      })
      api.getUser()
      .then(user => {
      console.log(user)
      if (user._id === this.state.user._id) {
        this.setState({
          isMe: true
        })

      }
    })
    })
    .catch(err => console.log(err))
  }


  render() {
    return (
      <div className="Home" style={{backgroundImage: `url("../map.jpg")`}}>
      <h1 className="page-title">Profile</h1>
      <div className="feliProfile">
          <div className="card text-center w-50">
          { this.state.user && 
          <div className="card-body">
          {this.state.user.imageURL && <img src={this.state.user.imageURL} height="300px" />}
          <br/><br/>
          <h5 className="card-title">{this.state.user.username}</h5>
          <p className="card-text">{this.state.isMe}</p><br></br>
          { this.state.isMe && <Link to='/profile' className="user-link">Edit Profile</Link>}
          </div>}
          </div>
      </div>
      </div>
    )
  }
  
}


