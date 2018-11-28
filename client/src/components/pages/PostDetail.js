import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default class PostDetail extends Component {
  render() {
    let curId = this.props.match.params.id
    let curPost = this.props.posts.find(post => post._id === curId)

    if (!curPost) {
      return <div />
    }

    return (
      <div>
        <h2>{curPost.title}</h2>
        
        <h4>Description</h4>
        {curPost.text}


        <h4>Owner</h4>
        {curPost._owner.username}
      </div>
    )
  }
}
