import React, { Component } from 'react'
import { getSecret } from '../api'

const defaultSecret = '*'.repeat(10)

export default class extends Component {
  state = {
    secret: defaultSecret
  }

  componentWillReceiveProps ({ user }) {
    this.resetSecret()
    if (user) {
      this.loadSecret(user)
    }
  }

  resetSecret () {
    this.setState({ secret: defaultSecret })
  }

  async loadSecret (user) {
    const token = await user.getIdToken()
    const secret = await getSecret(token)
    this.setState({ secret })
  }

  render () {
    const { secret } = this.state
    return <pre>{JSON.stringify(secret, null, 2)}</pre>
  }
}
