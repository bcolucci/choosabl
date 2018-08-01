import React, { PureComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import withAll from '../utils/combinedWith'
import randomAvatar from '../utils/randomAvatar'

export default withAll(
  class extends PureComponent {
    render () {
      const { classes } = this.props
      const sex = Math.random() > 0.5 ? 'm' : 'f'
      const avatar1 = randomAvatar(sex)
      const avatar2 = randomAvatar(sex, avatar1)
      return (
        <Grid container className={classes.root + ' with-padding'}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img src={avatar1} />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img src={avatar2} />
          </Grid>
        </Grid>
      )
    }
  }
)
