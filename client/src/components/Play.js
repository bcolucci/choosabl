import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { auth } from 'firebase'
import { Row, Button } from 'react-materialize'
import SignForm from './SignForm'
import Secret from './Secret'

export default withRouter(
  class extends Component {
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

    handleOnSignIn = async (email, password) => {
      await auth().signInWithEmailAndPassword(email, password)
      this.props.history.push('/')
    }

    handleSignInWithProvider (provider) {
      auth().signInWithPopup(provider)
    }

    handleSignOut = () => {
      auth().signOut()
      this.setState({ user: null })
    }

    renderSignInButtons () {
      return (
        <Row>
          <SignForm onSubmit={this.handleOnSignIn} buttonLabel='Sign In' />
          <Button
            style={{ backgroundColor: '#dd4b39' }}
            onClick={() =>
              this.handleSignInWithProvider(new auth.GoogleAuthProvider())}
          >
            Sign In with Google
          </Button>
          {' '}
          <Link to='/sign-up'>
            <Button>
              Create an Account
            </Button>
          </Link>
        </Row>
      )
    }

    render () {
      const { user } = this.state
      return (
        <div>
          <h2>Play</h2>
          {!user
            ? this.renderSignInButtons()
            : <Button onClick={this.handleSignOut}>
                Sign Out
              </Button>}
          <Secret user={user} />
        </div>
      )
    }
  }
)
