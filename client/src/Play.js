import React, { Component } from 'react'
import { auth } from 'firebase'
import { Button } from 'react-materialize'
import Secret from './components/Secret'

export default class extends Component {
  state = {
    user: null
  }

  componentWillMount () {
    this.removeAuthListener = auth().onAuthStateChanged(user => {
      this.setState({ user })
    })
  }

  componentWillUnmount () {
    this.removeAuthListener()
  }

  handleSignIn () {
    auth().signInWithPopup(new auth.GoogleAuthProvider())
  }

  handleSignOut = () => {
    auth().signOut()
    this.setState({ user: null })
  }

  render () {
    const { user } = this.state
    return (
      <div>
        <h2>Play</h2>
        {!user
          ? <Button onClick={this.handleSignIn}>
              Sign In
            </Button>
          : <Button onClick={this.handleSignOut}>
              Sign Out
            </Button>}
        <hr />
        <Secret user={user} />
      </div>
    )
  }
}
