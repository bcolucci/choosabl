import React, { PureComponent } from 'react'
import classnames from 'classnames'
import Typography from '@material-ui/core/Typography'
import WarningIcon from '@material-ui/icons/Warning'
import withAll from '../utils/with'

class VerifyYourEmail extends PureComponent {
  render () {
    const { t, classes } = this.props
    return (
      <Typography
        className={classnames([
          classes.spaced,
          classes.warningBg,
          classes.veryEmail
        ])}
      >
        <WarningIcon />
        {t(
          `email:Your email has not been verified yet. In order to be
          able to fully enjoy this application, you need to veriy it. Please check
          your emails.`
        )}
      </Typography>
    )
  }
}

export default withAll(VerifyYourEmail, {
  withIntl: true,
  withStyles: {
    styles: theme => ({
      veryEmail: {
        padding: '0.5em',
        fontWeight: 'bold'
      }
    })
  }
})
