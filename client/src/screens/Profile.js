import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { subYears } from 'date-fns'
import { DatePicker } from 'material-ui-pickers'
import withAll from '../utils/with'
import GenderPicker from '../components/GenderPicker'
import * as profilesAPI from '../api/profiles'
import { Typography } from '@material-ui/core'
import { auth } from 'firebase'

const maxBirthdayDate = subYears(new Date(), 14)

class Profile extends Component {
  static propTypes = {
    tab: PropTypes.string.isRequired
  }

  state = {
    loading: true,
    saving: false,
    username: '',
    birthday: null,
    gender: '',
    password: '',
    newPassword: '',
    newPassword2: ''
  }

  async componentWillMount () {
    const { username, birthday, gender } = this.state
    const profile = await profilesAPI.getCurrent()
    this.setState({
      loading: false,
      username: profile.username || username,
      birthday: profile.birthday || birthday,
      gender: profile.gender || gender
    })
  }

  handleChange = (field, synthetic = true) => e =>
    this.setState({ [field]: synthetic ? e.target.value : e })

  handleSave = async () => {
    this.setState({ saving: true })
    const { t, tab, history, showSuccess, showError } = this.props
    try {
      if (tab == 'profile') {
        const { username, birthday, gender } = this.state
        profilesAPI.updateCurrent({ username, birthday, gender })
        this.props.showSuccess(t('profile:profileSaved'))
      } else if (tab === 'updatePassword') {
        const { currentUser } = auth()
        const { password, newPassword, newPassword2 } = this.state
        await currentUser.reauthenticateWithCredential(
          auth.EmailAuthProvider.credential(currentUser.email, password)
        )
        if (newPassword !== newPassword2) {
          showError('New password does not match.')
        } else {
          await currentUser.updatePassword(newPassword)
          showSuccess('Password updated!')
        }
      } else {
        throw new Error('Unexpected tab.')
      }
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  renderProfile () {
    const { t, classes, history, user } = this.props
    const { saving } = this.state
    const { username, birthday, gender } = this.state
    return (
      <Grid container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography style={{ fontStyle: 'italic' }}>{user.email}</Typography>
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            autoFocus
            fullWidth
            required
            label={t('username')}
            value={username}
            onChange={this.handleChange('username')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <DatePicker
            disableFuture
            fullWidth
            label={t('birthday')}
            value={birthday}
            initialFocusedDate={maxBirthdayDate}
            maxDate={maxBirthdayDate}
            minDate={subYears(maxBirthdayDate, 100)}
            onChange={this.handleChange('birthday', false)}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <GenderPicker value={gender} onChange={this.handleChange('gender')} />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          {saving ? (
            <CircularProgress />
          ) : (
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleSave}
            >
              {t('save')}
            </Button>
          )}
          <Button
            color='primary'
            onClick={() => history.push('/profile/password')}
          >
            Update password
          </Button>
        </Grid>
      </Grid>
    )
  }

  renderUpdatePassword () {
    const { t, classes, history } = this.props
    const { saving } = this.state
    const { password, newPassword, newPassword2 } = this.state
    return (
      <Grid container>
        <Typography style={{ fontStyle: 'italic' }} className={classes.spaced}>
          Update your password:
        </Typography>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            autoFocus
            fullWidth
            required
            label={t('currentPassword')}
            value={password}
            type='password'
            onChange={this.handleChange('password')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            fullWidth
            required
            label={t('newPassword')}
            value={newPassword}
            type='password'
            onChange={this.handleChange('newPassword')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            fullWidth
            required
            label={t('newPassword2')}
            value={newPassword2}
            type='password'
            onChange={this.handleChange('newPassword2')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          {saving ? (
            <CircularProgress />
          ) : (
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleSave}
            >
              Update
            </Button>
          )}
          <Button color='primary' onClick={() => history.push('/profile')}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    )
  }

  render () {
    const { loading } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    return this.props.tab === 'profile'
      ? this.renderProfile()
      : this.renderUpdatePassword()
  }
}

export default withAll(Profile, {
  withRouter: true,
  withStyles: true,
  withMsgSnack: true,
  withIntl: ['profile']
})
