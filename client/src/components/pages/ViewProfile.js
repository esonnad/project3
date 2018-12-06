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
      <div> { this.state.user && 
        <div class="conditional-on-user">
          <div class="card">
            <p class="card-title">{this.state.user.username}</p>
            {/* <img src={this.state.user.imageURL} /> */}
            <p>See Public Posts by {this.state.user.username}</p>
            <p>{this.state.isMe}</p>
            { this.state.isMe && <Link to='/profile'>Edit Profile</Link>}
          </div>
        </div>

      }
      </div>
      
    )
  }
  
}


