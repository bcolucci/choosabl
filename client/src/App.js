import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { auth } from 'firebase'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles, withIntl } from './utils/combinedWith'
import Header from './components/Header'
import ProtectedRoutes from './components/ProtectedRoutes'
import Account from './screens/Account'
import { getSecret } from './api'

import './styles/App.css'

export default withStyles(
  withIntl(
    class extends Component {
      state = {
        user: null
      }

      componentWillMount () {
        this.removeAuthListener = auth().onAuthStateChanged(async user => {
          this.setState({ user })
          if (user) {
            const token = await user.getIdToken()
            const secret = await getSecret(token)
            console.log(secret)
          }
        })
      }

      componentWillUnmount () {
        this.removeAuthListener()
      }

      render () {
        const { user } = this.state
        return (
          <BrowserRouter>
            <div>
              <CssBaseline />
              <Header user={user} />
              <main>
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
  )
)
