import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/with'
import goto from '../utils/goto'

class Admin extends Component {
  static propTypes = {
    tab: PropTypes.string
  }

  static defaultProps = {
    tab: 'dashboard'
  }

  render () {
    const { classes, tab } = this.props
    const go = goto(this.props)
    return (
      <div>
        <AppBar position='static' color='default'>
          <Tabs
            variant='fullWidth'
            value={Math.max(0, ['dashboard', 'photos'].indexOf(tab))}
          >
            <Tab
              label='Dashboard'
              onClick={go('/admin/dashboard')}
              className={classes.tab}
            />
            <Tab
              label='Photos'
              onClick={go('/admin/photos')}
              className={classes.tab}
            />
          </Tabs>
        </AppBar>
        <div className={classes.spaced}>
          {['', 'dashboard'].includes(tab) && (
            <Typography
              variant='subtitle1'
              className={classes.spaced}
              gutterBottom
            >
              Nothing here yet...
            </Typography>
          )}
          {tab === 'photos' && (
            <Typography
              variant='subtitle1'
              className={classes.spaced}
              gutterBottom
            >
              Photos
            </Typography>
          )}
        </div>
      </div>
    )
  }
}

export default withAll(Admin, {
  withRouter: true,
  withStyles: true
})
