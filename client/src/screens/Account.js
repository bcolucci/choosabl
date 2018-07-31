import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import withAll from '../utils/combinedWith'

const defaultBirthday = moment().subtract(18, 'years').format('MM/DD/YYYY')

export default withAll(
  class extends Component {
    state = {
      username: '',
      birthday: ''
    }
    render () {
      const { t, classes, user } = this.props
      return (
        <div>
          <Typography variant='headline' gutterBottom>
            {t('my-account')}
          </Typography>
          <p>{user.email}</p>
          <form className={classes.container} noValidate>
            <TextField
              type='date'
              label={t('birthday')}
              defaultValue={defaultBirthday}
              // className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
          </form>
        </div>
      )
    }
  }
)
