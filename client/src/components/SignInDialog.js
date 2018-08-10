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
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { SocialIcon } from 'react-social-icons'
import withAll from '../utils/combinedWith'

export default withAll(
  class extends Component {
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
      signUp: false,
      fullScreen: false,
      email: '',
      password: ''
    }

    constructor (props) {
      super(props)
      this.state.panel = props.panel
    }

    handleSignInWithProvider = async provider => {
      try {
        await auth().signInWithPopup(provider)
        window.location.replace('/')
      } catch (err) {
        window.alert(err.message)
      }
    }

    handleSignIn = async () => {
      const { showSuccess, showErr } = this.props
      const { email, password } = this.state
      try {
        await auth().signInWithEmailAndPassword(email, password)
      } catch (err) {
        return showErr(err.message)
      }
      showSuccess('OKAY')
    }

    renderSignInWithEmail () {
      const { t, classes } = this.props
      const { signUp, email, password } = this.state
      const handleClose = () =>
        this.setState({
          panel: 'SignIn',
          signUp: false,
          fullScreen: false
        })
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
                Sign {signUp ? 'Up' : 'In'}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.spaced}>
            <DialogContent>
              <DialogContentText>
                {!signUp ? (
                  <span>Sign In with your existing account.</span>
                ) : (
                  <span>
                    Create an account with your email address. You'll receive a
                    confirmation email.
                  </span>
                )}
              </DialogContentText>
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
                      this.setState({ email: target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.spaced}>
                  <TextField
                    fullWidth
                    required
                    autoComplete='off'
                    label='Password'
                    type='password'
                    value={password}
                    onChange={({ target }) =>
                      this.setState({ password: target.value })
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
              <Button
                onClick={this.handleSignIn}
                color='primary'
                variant='contained'
              >
                Sign {signUp ? 'Up' : 'In'}
              </Button>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
            </DialogActions>
            {!signUp && (
              <div style={{ marginTop: '1.5em', textAlign: 'center' }}>
                <Button
                  onClick={() => this.setState({ signUp: true })}
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
      return (
        <div>
          <DialogTitle>Sign In</DialogTitle>
          <DialogContent>
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
  },
  {
    styles: theme => ({
      socialIcon: {
        width: '32px !important',
        height: '32px !important'
      }
    })
  }
)
