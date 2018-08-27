import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { auth } from 'firebase'
import { validate as isValidEmail } from 'email-validator'
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
import { createCurrentProfile } from '../api/profiles'
import { apiURL } from '../api'

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

  handleSignInWithProvider = provider => async e => {
    e.preventDefault()
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
      if (!isValidEmail(email)) {
        throw new Error('Invalid email.')
      }
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
          await createCurrentProfile(email)
          localStorage.setItem(user.uid, '1')
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

  handleSignInWithLinkedIn = e => {
    e.preventDefault()
    const crsf =
      Math.floor(Math.random() * 99).toString(16) +
      new Date().getTime().toString(16)
    localStorage.setItem('linkedin_crsf', crsf)
    window.location.replace(`${apiURL}/profiles/auth/linkedin?crsf=${crsf}`)
  }

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
      () => focusEmail && document.querySelector('input[type=email]').focus()
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

  renderSocialSignIn () {
    const { classes } = this.props
    return (
      <div style={{ marginTop: 30 }}>
        <Typography variant='caption' gutterBottom>
          or via social networks:
        </Typography>
        <IconButton
          className={classes.tinyspaced}
          onClick={this.handleSignInWithProvider(new auth.GoogleAuthProvider())}
        >
          <SocialIcon url='https://google.com' />
        </IconButton>
        <IconButton
          className={classes.tinyspaced}
          onClick={this.handleSignInWithProvider(
            new auth.FacebookAuthProvider()
          )}
        >
          <SocialIcon url='https://facebook.com' />
        </IconButton>
        <IconButton
          className={classes.tinyspaced}
          onClick={this.handleSignInWithLinkedIn}
        >
          <SocialIcon url='https://linkedin.com' />
        </IconButton>
        <IconButton
          className={classes.tinyspaced}
          onClick={this.handleSignInWithProvider(
            new auth.TwitterAuthProvider()
          )}
        >
          <SocialIcon url='https://twitter.com' />
        </IconButton>
      </div>
    )
  }

  renderSignIn () {
    const { t } = this.props
    const { saving } = this.state
    return (
      <div>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          {saving ? (
            <CircularProgress style={{ margin: '40px 100px' }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Button
                color='primary'
                variant='outlined'
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
              {this.renderSocialSignIn()}
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
