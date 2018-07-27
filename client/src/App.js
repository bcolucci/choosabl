import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Navbar, NavItem } from 'react-materialize'
import { auth } from 'firebase'
import Play from './Play'
import Account from './Account'

class ProtectedRoutes extends Component {
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
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

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

  render () {
    const { user } = this.state
    return (
      <BrowserRouter>
        <div className='root'>
          <Navbar brand='Choosabl' right>
            <NavItem href='/play'>
              Play
            </NavItem>
            <NavItem href='/account'>
              Account
            </NavItem>
          </Navbar>
          <Route path='/play' component={Play} />
          <ProtectedRoutes user={user}>
            <Route
              path='/account'
              render={props => <Account {...props} user={user} />}
            />
          </ProtectedRoutes>
        </div>
      </BrowserRouter>
    )
  }
}
