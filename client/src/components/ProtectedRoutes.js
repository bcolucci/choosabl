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
      return null
    }
    return <div>{this.props.children}</div>
  }
}
