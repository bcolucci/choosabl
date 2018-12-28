import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { auth } from 'firebase'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'
import withAll from './utils/with'
import Header from './components/Header'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './screens/Home'
import Legal from './screens/Legal'
import Vote from './screens/Vote'
import Battles from './screens/Battles'
import Profile from './screens/Profile'
import Invite from './screens/Invite'
import Splash from './components/Splash'
import { apiURL } from './api'
import { createCurrentProfile } from './api/profiles'
import theme from './theme'

import './App.css'

class App extends Component {
  state = {
    user: null,
    loading: true
  }

  componentDidMount () {
    this.catchReferrer()
    this.catchLinkedInAuthCallback()
    this.listenAuthUserChange()
  }

  componentWillUnmount () {
    this.removeAuthListener()
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
      this.props.history.push('/')
    }
  }

  async catchLinkedInAuthCallback () {
    const { history } = this.props
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
      return history.push('/')
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
      auth().signInWithCustomToken(token)
      // history.push('/')
    }
  }

  renderProtectedRoutes () {
    const { user } = this.state
    return (
      <ProtectedRoutes user={user}>
        <Route path='/vote' render={() => <Vote user={user} />} />
        <Route path='/invite' render={() => <Invite user={user} />} />
        <Route
          path='/battles/actives'
          render={() => <Battles user={user} tab='actives' />}
        />
        <Route
          path='/battles/drafts'
          render={() => <Battles user={user} tab='drafts' />}
        />
        <Route
          path='/battles/create'
          render={() => <Battles user={user} tab='create' />}
        />
        <Route exact path='/battles' render={() => <Battles user={user} />} />
        <Route
          path='/profile/password'
          render={() => <Profile user={user} tab='updatePassword' />}
        />
        <Route
          path='/profile/badges'
          render={() => <Profile user={user} tab='badges' />}
        />
        <Route
          exact
          path='/profile'
          render={() => <Profile user={user} tab='profile' />}
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
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <CssBaseline />
          <Header user={user} />
          <main>
            {this.renderProtectedRoutes()}
            <Route
              exact
              path='/legal'
              render={props => <Legal user={user} />}
            />
            <Route exact path='/' render={props => <Home user={user} />} />
          </main>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    )
  }
}

export default withAll(App, {
  withRouter: true,
  withStyles: true,
  withIntl: true
})
