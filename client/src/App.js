import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { auth } from 'firebase'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import LinearProgress from '@material-ui/core/LinearProgress'
import CssBaseline from '@material-ui/core/CssBaseline'
import withAll from './utils/with'
import Header from './components/Header'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './screens/Home'
import Vote from './screens/Vote'
import Battles from './screens/Battles'
import Profile from './screens/Profile'
import { createCurrentProfile } from './api/profiles'

import './App.css'

class App extends Component {
  state = {
    user: null,
    loading: true
  }

  componentWillMount () {
    this.removeAuthListener = auth().onAuthStateChanged(async user => {
      if (user) {
        if (!localStorage.getItem(user.uid)) {
          await createCurrentProfile()
          localStorage.setItem(user.uid, '1')
        }
      }
      this.setState({ user, loading: false })
    })
  }

  componentWillUnmount () {
    this.removeAuthListener()
  }

  render () {
    const { user, loading } = this.state
    if (loading) {
      return <LinearProgress color='primary' />
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <BrowserRouter>
          <div>
            <Header user={user} />
            <main>
              <ProtectedRoutes user={user}>
                <Route
                  exact
                  path='/vote'
                  render={props => <Vote {...props} user={user} />}
                />
                <Route
                  exact
                  path='/battles'
                  render={props => <Battles {...props} user={user} />}
                />
                <Route
                  exact
                  path='/battles/actives'
                  render={props => <Battles {...props} user={user} menu={0} />}
                />
                <Route
                  exact
                  path='/battles/drafts'
                  render={props => <Battles {...props} user={user} menu={1} />}
                />
                <Route
                  exact
                  path='/battles/create'
                  render={props => <Battles {...props} user={user} menu={2} />}
                />
                <Route
                  exact
                  path='/profile'
                  render={props => <Profile {...props} user={user} />}
                />
              </ProtectedRoutes>
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
