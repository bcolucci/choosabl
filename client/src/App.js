import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { auth } from 'firebase'
import MuiPickersUtilsProvider
  from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles, withIntl } from './utils/combinedWith'
import Header from './components/Header'
import ProtectedRoutes from './components/ProtectedRoutes'
import Home from './screens/Home'
import Vote from './screens/Vote'
import Battles from './screens/Battles'
import Profile from './screens/Profile'

import './styles/App.css'

export default withStyles(
  withIntl(
    class extends Component {
      state = {
        user: null
      }

      componentWillMount () {
        this.removeAuthListener = auth().onAuthStateChanged(user =>
          this.setState({ user })
        )
      }

      componentWillUnmount () {
        this.removeAuthListener()
      }

      render () {
        const { user } = this.state
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CssBaseline />
            <BrowserRouter>
              <div>
                <Header user={user} />
                <main>
                  <ProtectedRoutes user={user}>
                    <Route
                      path='/vote'
                      render={props => <Vote {...props} user={user} />}
                    />
                    <Route
                      path='/battles'
                      render={props => <Battles {...props} user={user} />}
                    />
                    <Route
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
  )
)
