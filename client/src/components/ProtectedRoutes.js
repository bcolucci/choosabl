import React, { Component } from 'react'
import { auth } from 'firebase'

export default class extends Component {
  state = {
    user: null
  }

  componentWillReceiveProps ({ user }) {
    this.setState({ user })
  }

  render () {
    const { user } = this.state
    if (!user && !auth().currentUser) {
      if (window.location.pathname !== '/') {
        window.location.replace('/')
      }
      return null
    }
    return <div>{this.props.children}</div>
  }
}
