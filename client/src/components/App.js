import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Navbar, NavItem, Icon } from 'react-materialize'
import { auth } from 'firebase'
import Play from './Play'
import Account from './Account'
import SignUp from './SignUp'

import './App.css'

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
          <Navbar left>
            <NavItem href='/'>
              <Icon>home</Icon>
            </NavItem>
            <NavItem href='/sign-up' style={{ display: !!user && 'none' }}>
              Register
            </NavItem>
            <NavItem href='/play'>
              Play
            </NavItem>
            <NavItem href='/account' style={{ display: !user && 'none' }}>
              Account
            </NavItem>
          </Navbar>
          <main>
            <Route exact path='/' component={Play} />
            <Route path='/play' component={Play} />
            <Route path='/sign-up' component={SignUp} />
            <ProtectedRoutes user={user}>
              <Route
                path='/account'
                render={props => <Account {...props} user={user} />}
              />
            </ProtectedRoutes>
          </main>
        </div>
      </BrowserRouter>
    )
  }
}
