import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import { auth } from 'firebase'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AccountIcon from '@material-ui/icons/AccountCircle'
import { withStyles, withIntl } from './utils/combinedWith'
import ProtectedRoutes from './components/ProtectedRoutes'
import Account from './screens/Account'

import './styles/App.css'

export default withStyles(
  withIntl(
    class extends Component {
      state = {
        user: null,
        menuEl: null
      }

      componentWillMount () {
        this.removeAuthListener = auth().onAuthStateChanged(user => {
          this.setState({ user })
        })
      }

      componentWillUnmount () {
        this.removeAuthListener()
      }

      handleSignInWithProvider = async provider => {
        await auth().signInWithPopup(provider)
      }

      handleSignOut = () => {
        auth().signOut()
        this.handleCloseUserMenu()
        window.location.replace('/')
      }

      handleCloseUserMenu = () => {
        this.setState({ menuEl: null })
      }

      renderUserMenu () {
        const { menuEl } = this.state
        const { t } = this.props
        return (
          <ClickAwayListener onClickAway={this.handleCloseUserMenu}>
            <Menu
              anchorEl={menuEl}
              open={!!menuEl}
              onClose={this.handleCloseUserMenu}
            >
              <MenuItem onClick={this.handleCloseUserMenu}>
                <Link to='/account'>
                  {t('my-account')}
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleSignOut}>
                {t('sign-out')}
              </MenuItem>
            </Menu>
          </ClickAwayListener>
        )
      }

      renderHeader () {
        const { user, menuEl } = this.state
        const { classes } = this.props
        const authenticated = !!user
        return (
          <header className={classes.root}>
            <AppBar position='static'>
              <Toolbar>
                <Typography
                  className={classes.flex}
                  variant='title'
                  color='inherit'
                >
                  Choosabl
                </Typography>
                {!authenticated &&
                  <Button
                    color='inherit'
                    onClick={() =>
                      this.handleSignInWithProvider(
                        new auth.GoogleAuthProvider()
                      )}
                  >
                    <AccountIcon />
                  </Button>}
                {authenticated &&
                  <div>
                    <Button
                      color='inherit'
                      aria-owns={menuEl ? 'fade-menu' : null}
                      aria-haspopup='true'
                      onClick={({ currentTarget }) =>
                        this.setState({ menuEl: currentTarget })}
                    >
                      <Avatar src={user.photoURL} />
                    </Button>
                    {this.renderUserMenu()}
                  </div>}
              </Toolbar>
            </AppBar>
          </header>
        )
      }

      render () {
        const { user } = this.state
        return (
          <BrowserRouter>
            <div>
              {this.renderHeader()}
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
