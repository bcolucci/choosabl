import React, { PureComponent } from 'react'
import classnames from 'classnames'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'

class VerifyYourEmail extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <Typography
        className={classnames([
          classes.spaced,
          classes.errorBg,
          classes.veryEmail
        ])}
      >
        Your email has not been verified yet. In order to be able to fully enjoy
        this application, you need to veriy it. Please check your emails.
      </Typography>
    )
  }
}

export default withAll(VerifyYourEmail, {
  withStyles: {
    styles: theme => ({
      veryEmail: {
        padding: '0.5em',
        color: '#fff'
      }
    })
  }
})
