import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'

class Legal extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <Grid container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography>Soon...</Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withAll(Legal, {
  withStyles: true
})
