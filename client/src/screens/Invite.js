import React, { Component } from 'react'
import { validate as isValidEmail } from 'email-validator'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'
import VerifyYourEmail from '../components/VerifyYourEmail'
import * as invitationsAPI from '../api/invitations'

class Invite extends Component {
  state = {
    email: '',
    alreadyInvited: false,
    loading: false
  }

  handleSave = async () => {
    this.setState({ loading: true })
    const { email } = this.state
    const { showError, showSuccess } = this.props
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email.')
      }
      const alreadyInvited = await invitationsAPI.alreadyInvited(email)
      if (alreadyInvited) {
        showError('You already invite this user.')
        return this.setState({ alreadyInvited: true, loading: false })
      }
      await invitationsAPI.invite(email)
      this.setState({ email: '' })
      showSuccess(`${email} has been invited. Thank you!`)
      setImmediate(() =>
        window.document.querySelector('input[type=email]').focus()
      )
    } catch (err) {
      showError(err.message)
    }
    this.setState({ loading: false })
  }

  handleReInvite = () => window.alert('Not implemented yet.')

  render () {
    const { t, classes, user } = this.props
    const { loading, email, alreadyInvited } = this.state
    if (!user.emailVerified) {
      return <VerifyYourEmail />
    }
    return (
      <Grid container>
        <Typography className={classes.spaced}>
          Please enter the email of the one you want to invite:
        </Typography>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            autoFocus
            fullWidth
            required
            label='Email Address'
            type='email'
            value={email}
            onChange={({ target }) =>
              this.setState({ email: target.value, alreadyInvited: false })
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              <Button
                onClick={this.handleSave}
                color='primary'
                variant='contained'
              >
                {t('invite')}
              </Button>
              {alreadyInvited && (
                <Button
                  onClick={this.handleReInvite}
                  color='secondary'
                  variant='contained'
                  style={{ marginLeft: 5 }}
                >
                  Invite again
                </Button>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    )
  }
}

export default withAll(Invite, {
  withStyles: true,
  withIntl: true,
  withMsgSnack: true
})
