import React, { Component } from 'react'
import firebase from 'firebase'
import Button from '@material-ui/core/Button'
import Secret from './components/Secret'

export default class extends Component {

  state = {
    user: null
  }

  componentWillMount() {
    this.removeAuthListener = firebase.auth().onAuthStateChanged(user => {
      this.setState({ user })
    })
  }

  componentWillUnmount() {
    this.removeAuthListener()
  }

  handleSignIn = async () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  handleSignOut = async () => {
    firebase.auth().signOut()
  }

  render() {
    const { user } = this.state
    return (
      <div>
        <h2>Play</h2>
        {!user ? (
          <Button variant='contained' color='primary' onClick={this.handleSignIn}>
            Sign In
          </Button>
        )
          : (
            <Button variant='contained' color='secondary' onClick={this.handleSignOut}>
              Sign Out
            </Button>
          )
        }
        <hr />
        <Secret />
      </div >
    )
  }

}
