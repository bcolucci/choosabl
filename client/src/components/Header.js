import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { auth } from 'firebase'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ThumbsUpIcon from '@material-ui/icons/ThumbsUpDown'
import PhotoLibrary from '@material-ui/icons/PhotoLibrary'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Divider from '@material-ui/core/Divider'
import withAll from '../utils/combinedWith'
import i18n from '../utils/initializeI18n'
import FlagIcon from './FlagIcon'
import SignInDialog from './SignInDialog'

export default withAll(
  class extends Component {
    static propTypes = {
      user: PropTypes.object
    }

    state = {
      lang: i18n.language,
      userMenuEl: null,
      langMenuEl: null,
      isSignInDiagOpened: false
    }

    componentWillMount () {
      i18n.on('languageChanged', this.handleLangChange)
    }

    componentWillUnmount () {
      i18n.off('languageChanged', this.handleLangChange)
    }

    handleLangChange = lang => {
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
              <Link to='/profile'>{t('profile')}</Link>
            </MenuItem>
            <MenuItem
              onClick={e =>
                e.preventDefault() || window.alert('Not implemented yet.')}
            >
              <Link to='/plan'>{t('plan')}</Link>
            </MenuItem>
            <Divider />
            <MenuItem onClick={this.handleSignOut}>{t('sign-out')}</MenuItem>
          </Menu>
        </ClickAwayListener>
      )
    }

    renderLangMenu () {
      // const { t } = this.props
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
                {/* {t(`langs:${l}`)} */}
              </MenuItem>
            ))}
          </Menu>
        </ClickAwayListener>
      )
    }

    render () {
      const { user, classes, history } = this.props
      const { lang, userMenuEl, langMenuEl, isSignInDiagOpened } = this.state
      const authenticated = !!user
      return (
        <header className={classes.root}>
          <AppBar position='static'>
            <Toolbar>
              <Typography
                className={classes.title}
                onClick={() => history.push('/')}
                variant='title'
                color='inherit'
              >
                choosabl
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
                  <Button color='inherit' onClick={() => history.push('/vote')}>
                    <ThumbsUpIcon />
                  </Button>
                  <Button
                    color='inherit'
                    onClick={() => history.push('/battles')}
                  >
                    <Badge color='secondary' badgeContent={2}>
                      <PhotoLibrary />
                    </Badge>
                  </Button>
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
  },
  {
    styles: theme => ({
      title: {
        flexGrow: 1,
        cursor: 'pointer'
      }
    })
  }
)
