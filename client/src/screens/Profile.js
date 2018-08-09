import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
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
      saving: false,
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

    handleChange = (field, synthetic = true) => e =>
      this.setState({ [field]: synthetic ? e.target.value : e })

    handleSave = () => {
      this.setState({ saving: true })
      const { username, birthday, gender } = this.state
      profilesAPI.updateCurrent({ username, birthday, gender })
      this.setState({ showSavedMsg: true, saving: false })
    }

    render () {
      const { t, classes } = this.props
      const { loading, saving, showSavedMsg } = this.state
      const { username, birthday, gender } = this.state
      if (loading) {
        return <LinearProgress color='secondary' />
      }
      return (
        <div className='with-padding'>
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
                onChange={this.handleChange('birthday', false)}
              />
            </Grid>
            <Grid item xs={12} className={classes.spaced}>
              <GenderPicker
                value={gender}
                onChange={this.handleChange('gender')}
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
