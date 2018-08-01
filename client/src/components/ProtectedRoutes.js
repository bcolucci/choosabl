import React, { Component } from 'react'

export default class extends Component {
  state = {
    user: null
  }

  componentWillReceiveProps ({ user }) {
    this.setState({ user })
  }

  render () {
    const { user } = this.state
    if (!user) {
      const { location } = window
      if (location.host !== 'localhost:3000' && location.pathname !== '/') {
        location.replace('/')
      }
      return null
    }
    return <div>{this.props.children}</div>
  }
}
