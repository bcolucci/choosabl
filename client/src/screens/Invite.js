import React, { Component, Fragment } from 'react'
import { EventEmitter } from 'events'
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
import DeleteIcon from '@material-ui/icons/Delete'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'
import VerifyYourEmail from '../components/VerifyYourEmail'
import * as invitationsAPI from '../api/invitations'

class Invite extends Component {
  state = {
    email: '',
    message: '',
    invitedList: [],
    inDeletion: null,
    saving: false,
    loading: true
  }

  constructor (props) {
    super(props)
    this.customListener = new EventEmitter()
  }

  componentDidMount () {
    this.customListener.on('listLoaded', this._handleListLoaded)
    this.loadInvitedList()
  }

  componentWillUnmount () {
    this.customListener.removeAllListeners()
  }

  _handleListLoaded = invitedList =>
    this.setState({ invitedList, loading: false })

  async loadInvitedList () {
    const list = await invitationsAPI.invitedList()
    this.customListener.emit('listLoaded', list)
  }

  handleSave = async () => {
    this.setState({ saving: true })
    const { email, message, invitedList } = this.state
    const { t, showError, showSuccess } = this.props
    try {
      if (!isValidEmail(email)) {
        throw new Error(t('Invalid email.'))
      }
      if (
        invitedList.includes(email) ||
        (await invitationsAPI.isInvited(email))
      ) {
        showError(t('You already invite this user.'))
        return this.setState({ saving: false })
      }
      await invitationsAPI.invite({ email, message })
      this.setState({ email: '', message: '' })
      showSuccess(t('{{email}} has been invited. Thank you!', { email }))
      setImmediate(() => document.querySelector('input[type=email]').focus())
      this.loadInvitedList()
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  handleReInvite = () => {
    const { t } = this.props
    window.alert(t('Not implemented yet.'))
  }

  handleDelete = email => async () => {
    this.setState({ inDeletion: email })
    await invitationsAPI.deleteOne(email)
    this.props.events.delete(email.replace('@', ' '))
    const invitedList = this.state.invitedList.filter(e => e !== email)
    this.setState({ invitedList, inDeletion: null })
  }

  renderInvitedList () {
    const { t } = this.props
    const { invitedList, inDeletion } = this.state
    if (!invitedList.length) {
      return (
        <Typography style={{ marginTop: 5 }}>
          {t('No invitation sent yet.')}
        </Typography>
      )
    }
    return (
      <List>
        {invitedList.map((email, idx) => {
          const disabled = inDeletion === email
          return (
            <ListItem key={idx} disabled={disabled}>
              <ListItemText primary={email} />
              <ListItemSecondaryAction>
                <IconButton onClick={this.handleReInvite} disabled={disabled}>
                  <EmailIcon />
                </IconButton>
                <IconButton
                  onClick={this.handleDelete(email)}
                  disabled={disabled}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
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
      <Fragment>
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.spaced}>
            <TextField
              autoFocus
              required
              fullWidth
              label={t('Email Address')}
              type='email'
              value={email}
              onChange={({ currentTarget }) =>
                this.setState({ email: currentTarget.value })
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.spaced}>
            <TextField
              multiline
              fullWidth
              rows={4}
              label={t('Custom message')}
              value={message}
              onChange={({ currentTarget }) =>
                this.setState({ message: currentTarget.value.substr(0, 300) })
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.spaced}>
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
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.spaced}>
            <Typography variant='h5'>{t('Invations sent:')}</Typography>
            {this.renderInvitedList()}
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}

export default withAll(Invite, {
  withMsgSnack: true
})
