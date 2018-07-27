import React from 'react'
import firebase from 'firebase'
import { getSecret } from '../api'

const defaultSecret = '*'.repeat(10)

export default class extends React.PureComponent {

  state = {
    secret: defaultSecret
  }

  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        this.setState({ secret: defaultSecret })
        return
      }
      const token = await firebase.auth().currentUser.getIdToken(true)
      const secret = await getSecret(token)
      this.setState({ user, secret })
    })
  }

  componentWillUnmount() {
    this.removeAuthListener()
  }

  render() {
    const { secret } = this.state
    return (
      <div>
        <p>Secret:</p>
        <pre>{JSON.stringify(secret, null, 2)}</pre>
      </div>
    )
  }

}
