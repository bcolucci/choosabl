import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { auth } from 'firebase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { SocialIcon } from 'react-social-icons'
import withAll from '../utils/with'

const unexpectedTabErr = new Error('Unexpected tab.')

class SignInDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    panel: PropTypes.string,
    onClose: PropTypes.func
  }

  static defaultProps = {
    panel: 'SignIn'
  }

  state = {
    panel: null,
    tab: 'signIn',
    fullScreen: false,
    email: '',
    password: '',
    saving: false,
    focusEmail: false
  }

  constructor (props) {
    super(props)
    this.state.panel = props.panel
  }

  handleSignInWithProvider = async provider => {
    this.setState({ saving: true })
    try {
      await auth().signInWithRedirect(provider)
    } catch (err) {
      this.props.showError(err.message)
      this.setState({ saving: false })
    }
  }

  handleSignIn = async () => {
    this.setState({ saving: true })
    const { history, showSuccess, showError } = this.props
    const { tab, email, password } = this.state
    try {
      switch (tab) {
        case 'signIn':
          await auth().signInWithEmailAndPassword(email, password)
          return history.replace('/')
        case 'signUp':
          const { user } = await auth().createUserWithEmailAndPassword(
            email,
            password
          )
          await user.sendEmailVerification()
          break
        case 'forgot':
          await auth().sendPasswordResetEmail(email)
          showSuccess('Recovering email sent!')
          this.setState({ tab: 'signIn' })
          break
        default:
          throw unexpectedTabErr
      }
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  handleForgetMyPassword = async () => {}

  contextMessage () {
    const { tab } = this.state
    switch (tab) {
      case 'signIn':
        return <span>Sign In with your existing account.</span>
      case 'signUp':
        return (
          <span>
            Create an account with your email address. You'll receive a
            confirmation email.
          </span>
        )
      case 'forgot':
        return (
          <span>
            Enter your email in order for use to send you a recovering email.
          </span>
        )
      default:
        throw unexpectedTabErr
    }
  }

  renderSignInWithEmail () {
    const { t, classes } = this.props
    const { email, password } = this.state
    const { tab, focusEmail, saving } = this.state
    const handleClose = () =>
      this.setState({
        panel: 'SignIn',
        tab: 'signIn',
        focusEmail: true,
        fullScreen: false
      })
    setImmediate(
      () =>
        focusEmail && window.document.querySelector('input[type=email]').focus()
    )
    return (
      <div>
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <IconButton color='inherit' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography
              variant='title'
              color='inherit'
              className={classes.flex}
            >
              {(() => {
                switch (tab) {
                  case 'signIn':
                    return 'Sign In'
                  case 'signUp':
                    return 'Sign Up'
                  case 'forgot':
                    return 'Recover password'
                  default:
                    throw unexpectedTabErr
                }
              })()}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.spaced}>
          <DialogContent>
            <DialogContentText>{this.contextMessage()}</DialogContentText>
            <br />
            <Grid container>
              <Grid item xs={12} className={classes.spaced}>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label='Email Address'
                  type='email'
                  value={email}
                  onChange={({ target }) =>
                    this.setState({ email: target.value, focusEmail: false })
                  }
                />
              </Grid>
              {tab !== 'forgot' && (
                <Grid item xs={12} className={classes.spaced}>
                  <TextField
                    fullWidth
                    required
                    autoComplete='off'
                    label='Password'
                    type='password'
                    value={password}
                    onChange={({ target }) =>
                      this.setState({
                        password: target.value,
                        focusEmail: false
                      })
                    }
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            {saving ? (
              <CircularProgress />
            ) : (
              <Button
                onClick={this.handleSignIn}
                color='primary'
                variant='contained'
              >
                {(() => {
                  switch (tab) {
                    case 'signIn':
                      return 'Sign In'
                    case 'signUp':
                      return 'Create account'
                    case 'forgot':
                      return 'Send email'
                    default:
                      throw unexpectedTabErr
                  }
                })()}
              </Button>
            )}
            <Button onClick={handleClose} color='primary'>
              {t('cancel')}
            </Button>
          </DialogActions>
          {tab === 'signIn' && (
            <div style={{ marginTop: '1.5em', textAlign: 'center' }}>
              <Button
                onClick={() => this.setState({ tab: 'forgot' })}
                color='primary'
              >
                Forgot password?
              </Button>
              <Button
                onClick={() => this.setState({ tab: 'signUp' })}
                color='primary'
              >
                No account ? Create one now!
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  renderSignIn () {
    const { t, classes } = this.props
    const { saving } = this.state
    return (
      <div>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          {saving ? (
            <CircularProgress />
          ) : (
            <div>
              <p style={{ textAlign: 'center' }}>
                <Button
                  color='primary'
                  onClick={() =>
                    this.setState({
                      panel: 'SignInWithEmail',
                      fullScreen: true
                    })
                  }
                >
                  {t('sign-in-with-provider', {
                    provider: 'email'
                  })}
                </Button>
              </p>
              <List>
                <ListItem
                  button
                  dense
                  onClick={() =>
                    this.handleSignInWithProvider(new auth.GoogleAuthProvider())
                  }
                >
                  <ListItemAvatar className={classes.socialIcon}>
                    <SocialIcon url='https://google.com' />
                  </ListItemAvatar>
                  <ListItemText
                    primary={t('sign-in-with-provider', {
                      provider: 'Google'
                    })}
                  />
                </ListItem>
                <ListItem
                  button
                  dense
                  onClick={() =>
                    this.handleSignInWithProvider(
                      new auth.FacebookAuthProvider()
                    )
                  }
                >
                  <ListItemAvatar className={classes.socialIcon}>
                    <SocialIcon url='https://facebook.com' />
                  </ListItemAvatar>
                  <ListItemText
                    primary={t('sign-in-with-provider', {
                      provider: 'Facebook'
                    })}
                  />
                </ListItem>
              </List>
            </div>
          )}
        </DialogContent>
      </div>
    )
  }

  render () {
    const { open, onClose } = this.props
    const { panel, fullScreen } = this.state
    return (
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={() => {
          this.setState({ panel: 'SignIn', fullScreen: false })
          onClose()
        }}
      >
        {this[`render${panel}`]()}
      </Dialog>
    )
  }
}

export default withAll(SignInDialog, {
  withIntl: true,
  withRouter: true,
  withMsgSnack: true,
  withStyles: {
    styles: theme => ({
      socialIcon: {
        width: '32px !important',
        height: '32px !important'
      }
    })
  }
})
