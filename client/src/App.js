import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import firebase from 'firebase'
import PrivateRoute from './components/PrivateRoute'
import Play from './Play'
import Account from './Account'

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

  render() {
    const { user } = this.state
    return (
      <BrowserRouter>
        <div>
          <h1>Choosabl</h1>
          <ul>
            <li>
              <Link to='/play'>Play</Link>
            </li>
            <li>
              <Link to='/account'>Account</Link>
            </li>
          </ul>
          <Route path='/play' component={Play} />
          <PrivateRoute path='/account' user={user} component={Account} />
        </div>
      </BrowserRouter>
    )
  }

}
