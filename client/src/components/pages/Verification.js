import React, { Component } from 'react'
import api from '../../api';

export default class Verification extends Component {
  componentDidMount(){
    let id = this.props.match.params.id
    api.verifyEmail(id)
  }
  render() {
    return (
      <div>
        <h1>Thank you! Your email was sucessfully verified!</h1>
      </div>
    )
  }
}
