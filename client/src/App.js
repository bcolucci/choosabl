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
import i18n from './utils/initializeI18n'
import FlagIcon from './components/FlagIcon'
import ProtectedRoutes from './components/ProtectedRoutes'
import SignInDialog from './components/SignInDialog'
import Account from './screens/Account'
import { getSecret } from './api'

import './styles/App.css'

export default withStyles(
  withIntl(
    class extends Component {
      state = {
        user: null,
        lang: null,
        userMenuEl: null,
        langMenuEl: null,
        isSignInDiagOpened: false
      }

      constructor (props) {
        super(props)
        this.state.lang = i18n.language
      }

      componentWillMount () {
        i18n.on('languageChanged', this.onLanguageChanged)
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
        i18n.off('languageChanged', this.onLanguageChanged)
        this.removeAuthListener()
      }

      onLanguageChanged = lang => {
        auth().languageCode = lang.substr(0, 2)
        this.setState({ lang })
      }

      handleSignOut = () => {
        auth().signOut()
        this.handleCloseMenus()
        window.location.replace('/')
      }

      handleCloseMenus = () =>
        this.setState({
          userMenuEl: null,
          langMenuEl: null
        })

      renderUserMenu () {
        const { userMenuEl } = this.state
        const { t } = this.props
        return (
          <ClickAwayListener onClickAway={this.handleCloseMenus}>
            <Menu
              anchorEl={userMenuEl}
              open={!!userMenuEl}
              onClose={this.handleCloseMenus}
            >
              <MenuItem onClick={this.handleCloseMenus}>
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

      renderLangMenu () {
        const { t } = this.props
        const { lang, langMenuEl } = this.state
        return (
          <ClickAwayListener onClickAway={this.handleCloseMenus}>
            <Menu
              anchorEl={langMenuEl}
              open={!!langMenuEl}
              onClose={this.handleCloseMenus}
            >
              {['en_GB', 'fr_FR'].map(l => (
                <MenuItem
                  key={l}
                  selected={l === lang}
                  onClick={() => {
                    i18n.changeLanguage(l)
                    this.handleCloseMenus()
                  }}
                >
                  <FlagIcon value={l} />
                  {t(`langs:${l}`)}
                </MenuItem>
              ))}
            </Menu>
          </ClickAwayListener>
        )
      }

      renderHeader () {
        const { lang, user } = this.state
        const { userMenuEl, langMenuEl } = this.state
        const { isSignInDiagOpened } = this.state
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
                    onClick={() => this.setState({ isSignInDiagOpened: true })}
                  >
                    <AccountIcon />
                  </Button>}
                {authenticated &&
                  <div>
                    <Button
                      color='inherit'
                      aria-owns={userMenuEl ? 'fade-menu' : null}
                      aria-haspopup='true'
                      onClick={({ currentTarget }) =>
                        this.setState({ userMenuEl: currentTarget })}
                    >
                      <Avatar src={user.photoURL} />
                    </Button>
                    {this.renderUserMenu()}
                  </div>}
                <div>
                  <Button
                    color='inherit'
                    aria-owns={langMenuEl ? 'fade-menu' : null}
                    aria-haspopup='true'
                    onClick={({ currentTarget }) =>
                      this.setState({ langMenuEl: currentTarget })}
                  >
                    <FlagIcon value={lang} style={{ marginRight: '-5px' }} />
                  </Button>
                  {this.renderLangMenu()}
                </div>
              </Toolbar>
            </AppBar>
            <SignInDialog
              open={isSignInDiagOpened}
              onClose={() => this.setState({ isSignInDiagOpened: false })}
            />
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
