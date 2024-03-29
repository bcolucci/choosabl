import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { auth } from 'firebase'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AccountIcon from '@material-ui/icons/AccountCircle'
import ThumbsUpIcon from '@material-ui/icons/ThumbsUpDown'
import SignInIcon from '@material-ui/icons/PermIdentity'
import PhotoLibrary from '@material-ui/icons/PhotoLibrary'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Divider from '@material-ui/core/Divider'
import i18n from '../utils/initializeI18n'
import FlagIcon from './FlagIcon'
import SignInDialog from './SignInDialog'
import goto from '../utils/goto'
import { langs } from '../i18n.config'

class Header extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  state = {
    lang: i18n.language,
    userMenuEl: null,
    langMenuEl: null,
    isSignInDiagOpened: false
  }

  constructor (props) {
    super(props)
    this.userMenuBtn = React.createRef()
  }

  componentDidMount () {
    i18n.on('languageChanged', this.handleLangChange)
  }

  componentWillUnmount () {
    i18n.off('languageChanged', this.handleLangChange)
  }

  handleLangChange = lang => {
    auth().languageCode = lang.substr(0, 2)
    this.setState({ lang })
  }

  handleSignOut = async () => {
    const { events, user } = this.props
    await auth().signOut()
    events.signOut(user.uid)
    this.handleCloseMenus()
    this.props.history.push('/')
  }

  handleCloseMenus = () => this.setState({ userMenuEl: null, langMenuEl: null })

  renderUserMenu () {
    const { userMenuEl, lang } = this.state
    const { t } = this.props
    return (
      <ClickAwayListener onClickAway={this.handleCloseMenus}>
        <Menu
          anchorEl={userMenuEl}
          open={!!userMenuEl}
          onClose={this.handleCloseMenus}
        >
          <MenuItem onClick={this.handleCloseMenus}>
            <Link to='/profile'>{t('Profile')}</Link>
          </MenuItem>
          <MenuItem onClick={this.handleCloseMenus}>
            <Link to='/invite'>{t('Invite')}</Link>
          </MenuItem>
          <MenuItem onClick={this.handleCloseMenus} disabled>
            <Link to='/plan'>{t('Plan')}</Link>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={({ currentTarget }) =>
              this.setState({ langMenuEl: currentTarget })
            }
          >
            <FlagIcon value={lang} />
            <span style={{ marginLeft: 5 }}>{t('langs:Language')}</span>
          </MenuItem>
          <MenuItem onClick={this.handleSignOut}>
            {t('profile:Sign out')}
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
          {langs.map(l => (
            <MenuItem
              key={l}
              selected={l === lang}
              onClick={() => {
                i18n.changeLanguage(l)
                auth().languageCode = l.substr(0, 2)
                this.handleCloseMenus()
              }}
            >
              <FlagIcon value={l} />
              <span style={{ marginLeft: 5 }}>{t(`langs:${l}`)}</span>
            </MenuItem>
          ))}
        </Menu>
      </ClickAwayListener>
    )
  }

  render () {
    const { user, classes } = this.props
    const { userMenuEl, isSignInDiagOpened } = this.state
    const authenticated = !!user
    const go = goto(this.props)
    return (
      <header className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <p
              style={{
                flexGrow: 1,
                margin: 0,
                marginTop: '5px',
                cursor: 'pointer'
              }}
            >
              <img
                src='/logo-bar.png'
                alt='Choosabl header logo'
                onClick={go('/')}
              />
            </p>
            {!authenticated && (
              <Button
                color='inherit'
                onClick={() => this.setState({ isSignInDiagOpened: true })}
              >
                <SignInIcon />
              </Button>
            )}
            {authenticated && (
              <Fragment>
                <Button color='inherit' onClick={go('/vote')}>
                  <ThumbsUpIcon />
                </Button>
                <Button color='inherit' onClick={go('/battles')}>
                  <PhotoLibrary />
                </Button>
                <Button
                  color='inherit'
                  ref={this.userMenuBtn}
                  aria-owns={userMenuEl ? 'fade-menu' : null}
                  aria-haspopup='true'
                  onClick={({ currentTarget }) =>
                    this.setState({ userMenuEl: currentTarget })
                  }
                >
                  {user.photoURL ? (
                    <Avatar src={user.photoURL} />
                  ) : (
                    <AccountIcon />
                  )}
                </Button>
                {this.renderUserMenu()}
                {this.renderLangMenu()}
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
        {!authenticated && (
          <SignInDialog
            open={isSignInDiagOpened}
            onClose={() => this.setState({ isSignInDiagOpened: false })}
          />
        )}
      </header>
    )
  }
}

export default Header
