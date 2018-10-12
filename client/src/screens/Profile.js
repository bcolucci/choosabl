import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AccountIcon from '@material-ui/icons/AccountCircle'
import GradeIcon from '@material-ui/icons/Grade'
import { subYears } from 'date-fns'
import { DatePicker } from 'material-ui-pickers'
import withAll from '../utils/with'
import goto from '../utils/goto'
import GenderPicker from '../components/GenderPicker'
import * as profilesAPI from '../api/profiles'
import Badges from './Profile/Badges'
import { auth } from 'firebase'

const maxBirthdayDate = subYears(new Date(), 14)

class Profile extends Component {
  static propTypes = {
    tab: PropTypes.string.isRequired
  }

  static defaultProps = {
    tab: 'profile'
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

  async componentDidMount () {
    const profile = await profilesAPI.getCurrent()
    this.setState(prev => ({
      loading: false,
      username: profile.username || prev.username,
      birthday: profile.birthday || prev.birthday,
      gender: profile.gender || prev.gender
    }))
  }

  handleChange = (field, synthetic = true) => e => {
    let value = synthetic ? e.currentTarget.value : e
    if (field === 'username') {
      value = value.substr(0, 30)
    }
    this.setState({ [field]: value })
  }

  handleSave = async () => {
    this.setState({ saving: true })
    const { t, tab, history, showSuccess, showError } = this.props
    try {
      if (tab === 'profile') {
        const { username, birthday, gender } = this.state
        profilesAPI.updateCurrent({ username, birthday, gender })
        this.props.showSuccess(t('profile:Your profile has been saved!'))
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
          setTimeout(() => history.push('/profile'), 2500)
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
    const [provider] = user.providerData
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
            label={t('profile:Username')}
            value={username}
            onChange={this.handleChange('username')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <DatePicker
            disableFuture
            fullWidth
            label={t('profile:Birthday')}
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
              {t('Save')}
            </Button>
          )}
          {provider &&
            provider.providerId === 'password' && (
            <Button
              color='primary'
              onClick={() => history.push('/profile/password')}
            >
              {t('profile:Update password')}
            </Button>
          )}
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
          {t('profile:Update your password:')}
        </Typography>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            autoFocus
            fullWidth
            required
            label={t('profile:Current password')}
            value={password}
            type='password'
            onChange={this.handleChange('password')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            fullWidth
            required
            label={t('profile:New Password')}
            value={newPassword}
            type='password'
            onChange={this.handleChange('newPassword')}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <TextField
            fullWidth
            required
            label={t('profile:New password check')}
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
              {t('save')}
            </Button>
          )}
          <Button color='primary' onClick={() => history.push('/profile')}>
            {t('cancel')}
          </Button>
        </Grid>
      </Grid>
    )
  }

  render () {
    const { t, classes, tab } = this.props
    const { loading } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    const tabValue = ['profile', 'updatePassword'].includes(tab) ? 0 : 1
    const go = goto(this.props)
    return (
      <div>
        <AppBar position='static' color='default'>
          <Tabs fullWidth value={tabValue}>
            <Tab
              label={t('profile:Profile')}
              onClick={go('/profile')}
              className={classes.tab}
              icon={<AccountIcon />}
            />
            <Tab
              label={t('profile:Badges')}
              onClick={go('/profile/badges')}
              className={classes.tab}
              icon={<GradeIcon />}
            />
          </Tabs>
        </AppBar>
        <div className={classes.spaced}>
          {tab === 'profile' && this.renderProfile()}
          {tab === 'updatePassword' && this.renderUpdatePassword()}
          {tab === 'badges' && <Badges user={this.props.user} />}
        </div>
      </div>
    )
  }
}

export default withAll(Profile, {
  withRouter: true,
  withStyles: true,
  withMsgSnack: true,
  withIntl: true
})
