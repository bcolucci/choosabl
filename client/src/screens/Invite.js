import React, { Component } from 'react'
import { validate as isValidEmail } from 'email-validator'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import EmailIcon from '@material-ui/icons/Email'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'
import VerifyYourEmail from '../components/VerifyYourEmail'
import * as invitationsAPI from '../api/invitations'

class Invite extends Component {
  state = {
    email: '',
    message: '',
    invitedList: [],
    saving: false,
    loading: true
  }

  async componentDidMount () {
    await this.refreshInvitedList()
    this.setState({ loading: false })
  }

  async refreshInvitedList () {
    const invitedList = await invitationsAPI.invitedList()
    this.setState({ invitedList })
  }

  handleSave = async () => {
    this.setState({ saving: true })
    const { email, message, invitedList } = this.state
    const { showError, showSuccess } = this.props
    try {
      if (!isValidEmail(email)) {
        throw new Error('Invalid email.')
      }
      if (
        invitedList.includes(email) ||
        (await invitationsAPI.isInvited(email))
      ) {
        showError('You already invite this user.')
        return this.setState({ saving: false })
      }
      await invitationsAPI.invite({ email, message })
      this.setState({ email: '', message: '' })
      showSuccess(`${email} has been invited. Thank you!`)
      setImmediate(() => document.querySelector('input[type=email]').focus())
      this.refreshInvitedList()
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  handleReInvite = () => window.alert('Not implemented yet.')

  renderInvitedList () {
    const { invitedList } = this.state
    if (!invitedList.length) {
      return (
        <Typography style={{ marginTop: 5 }}>
          No invitation sent yet.
        </Typography>
      )
    }
    return (
      <List>
        {invitedList.map((email, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={email} />
            <ListItemSecondaryAction>
              <IconButton>
                <EmailIcon onClick={this.handleReInvite} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    )
  }

  render () {
    const { t, classes, user } = this.props
    const { loading, saving } = this.state
    const { email, message } = this.state
    if (!user.emailVerified) {
      return <VerifyYourEmail />
    }
    if (loading) {
      return <LinearProgress color='secondary' />
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
            onChange={({ currentTarget }) =>
              this.setState({ email: currentTarget.value })
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label='Custom message'
            value={message}
            onChange={({ currentTarget }) =>
              this.setState({ message: currentTarget.value.substr(0, 300) })
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          {saving ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={this.handleSave}
              color='primary'
              variant='contained'
            >
              {t('invite')}
            </Button>
          )}
        </Grid>
        <br />
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='headline'>Invations sent:</Typography>
          {this.renderInvitedList()}
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
