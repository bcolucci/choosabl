import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { subYears } from 'date-fns'
import { DatePicker } from 'material-ui-pickers'
import withAll from '../utils/combinedWith'
import GenderPicker from '../components/GenderPicker'
import * as profilesAPI from '../api/profiles'

const maxBirthdayDate = subYears(new Date(), 14)

export default withAll(
  class extends Component {
    state = {
      loading: true,
      username: '',
      birthday: null,
      gender: '',
      showSavedMsg: null
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

    handleChange = field => e => {
      switch (e.constructor.name) {
        case 'SyntheticEvent':
          return this.setState({ [field]: e.target.value })
        case 'Date':
        default:
          this.setState({ [field]: e })
      }
    }

    handleSave = async () => {
      const { username, birthday, gender } = this.state
      await profilesAPI.updateCurrent({ username, birthday, gender })
      this.setState({ showSavedMsg: true })
    }

    render () {
      const { t, classes /*, user */ } = this.props
      const { loading, showSavedMsg } = this.state
      const { username, birthday, gender } = this.state
      if (loading) {
        return <LinearProgress color='secondary' />
      }
      return (
        <div className='with-padding'>
          <Typography variant='headline'>{t('profile')}</Typography>
          <Divider style={{ marginBottom: '1em' }} />
          {/* <p>
            <Typography>{user.email}</Typography>
          </p> */}
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={showSavedMsg}
            onClose={() => this.setState({ showSavedMsg: false })}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={<p id='message-id'>{t('profile:profileSaved')}</p>}
          />
          <Grid container>
            <Grid item xs={12} className={classes.spaced}>
              <TextField
                label={t('username')}
                value={username}
                onChange={this.handleChange('username')}
              />
            </Grid>
            <Grid item xs={12} className={classes.spaced}>
              <DatePicker
                disableFuture
                label={t('birthday')}
                value={birthday}
                initialFocusedDate={maxBirthdayDate}
                maxDate={maxBirthdayDate}
                minDate={subYears(maxBirthdayDate, 100)}
                onChange={this.handleChange('birthday')}
              />
            </Grid>
            <Grid item xs={12} className={classes.spaced}>
              <GenderPicker
                value={gender}
                onChange={this.handleChange('gender')}
              />
            </Grid>
            <Grid item xs={12} className={classes.spaced}>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleSave}
              >
                {t('save')}
              </Button>
            </Grid>
          </Grid>
        </div>
      )
    }
  },
  {
    namespaces: ['profile']
  }
)
