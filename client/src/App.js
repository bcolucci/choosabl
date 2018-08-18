import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { auth } from 'firebase'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import CssBaseline from '@material-ui/core/CssBaseline'
import withAll from './utils/with'
import Header from './components/Header'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './screens/Home'
import Vote from './screens/Vote'
import Battles from './screens/Battles'
import Profile from './screens/Profile'
import Invite from './screens/Invite'
import Splash from './components/Splash'
import { apiURL } from './api'
import { createCurrentProfile } from './api/profiles'

import './App.css'

class App extends Component {
  state = {
    user: null,
    loading: true
  }

  componentWillMount () {
    this.catchReferrer()
    this.catchLinkedInAuthCallback()
    this.listenAuthUserChange()
  }

  listenAuthUserChange () {
    this.removeAuthListener = auth().onAuthStateChanged(async user => {
      if (user) {
        this.lastUserId = user.uid
        if (!localStorage.getItem(user.uid)) {
          await createCurrentProfile()
          localStorage.setItem(user.uid, '1')
        }
      } else {
        localStorage.clear()
      }
      this.setState({ user, loading: false })
    })
  }

  catchReferrer () {
    const urlParams = new URLSearchParams(window.location.search)
    const referrer = urlParams.get('referrer')
    if (referrer) {
      localStorage.setItem('referrer', referrer)
      window.location.replace('/')
    }
  }

  async catchLinkedInAuthCallback () {
    const urlParams = new URLSearchParams(window.location.search)
    if (!urlParams.get('linkedin_callback')) {
      return
    }
    const lkcrsf = localStorage.getItem('linkedin_crsf')
    const state = urlParams.get('state')
    if (lkcrsf && (!state || lkcrsf !== state)) {
      return console.error('Authentication validation failed (1)')
    }
    const error = urlParams.get('error')
    if (error) {
      localStorage.removeItem('linkedin_crsf')
      console.error(`Authentication error: ${error}`)
      return window.location.replace('/')
    }
    const code = urlParams.get('code')
    if (code) {
      const referrer = localStorage.getItem('referrer')
      localStorage.removeItem('referrer')
      return window.location.replace(
        `${apiURL}/profiles/auth/linkedin?code=${code}&crsf=${state}&referrer=${referrer}`
      )
    }
    if (lkcrsf !== state) {
      localStorage.removeItem('linkedin_crsf')
      return console.error('Authentication validation failed (2)')
    }
    const token = urlParams.get('token')
    if (token) {
      localStorage.removeItem('linkedin_crsf')
      await auth().signInWithCustomToken(token)
      window.location.replace('/')
    }
  }

  componentWillUnmount () {
    this.removeAuthListener()
  }

  renderProtectedRoutes () {
    const { user } = this.state
    return (
      <ProtectedRoutes user={user}>
        <Route exact path='/vote' render={props => <Vote user={user} />} />
        <Route exact path='/invite' render={props => <Invite user={user} />} />
        <Route
          exact
          path='/battles'
          render={props => <Battles user={user} />}
        />
        <Route
          exact
          path='/battles/actives'
          render={props => <Battles user={user} tab='actives' />}
        />
        <Route
          exact
          path='/battles/drafts'
          render={props => <Battles user={user} tab='drafts' />}
        />
        <Route
          exact
          path='/battles/create'
          render={props => <Battles user={user} tab='create' />}
        />
        <Route
          exact
          path='/profile'
          render={props => <Profile user={user} tab='profile' />}
        />
        <Route
          exact
          path='/profile/password'
          render={props => <Profile user={user} tab='updatePassword' />}
        />
      </ProtectedRoutes>
    )
  }

  render () {
    const { user, loading } = this.state
    if (loading) {
      return <Splash />
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <BrowserRouter>
          <div>
            <Header user={user} />
            <main>
              {this.renderProtectedRoutes()}
              <Route exact path='/' component={Home} />
            </main>
          </div>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    )
  }
}

export default withAll(App, {
  withStyles: true,
  withIntl: true
})
