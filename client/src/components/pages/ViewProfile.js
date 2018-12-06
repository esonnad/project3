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
    console.log("mounting")
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
        console.log("state", this.state)

      }
    })
    })
    .catch(err => console.log(err))
  }


  render() {
    return (
      <div> 
      <h1 className="page-title">Profile</h1>
      { this.state.user && 
        <div className="conditional-on-user">
          <div className="card"><br></br>
            {this.state.user.imageURL && <img src={this.state.user.imageURL} height="300px" />}
            <br></br><p className="card-title user-name">{this.state.user.username}</p>
            {/* <p>See Public Posts by {this.state.user.username}</p> */}
            <p>{this.state.isMe}</p>
            { this.state.isMe && <Link to='/profile' className="user-link">Edit Profile</Link>}
            <br></br>
          </div>
        </div>

      }
      </div>
      
    )
  }
  
}


