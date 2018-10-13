import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import { Bar } from 'react-chartjs'
import BattlePhotosRow from './BattlePhotosRow'
import innerEllipse from '../utils/innerEllipse'
import withAll from '../utils/with'
import * as battlesAPI from '../api/battles'

class BattleStatsPreviewDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    battle: PropTypes.object.isRequired
  }

  state = {
    stats: null,
    loading: true
  }

  async componentDidMount () {
    const { battle } = this.props
    const stats = await battlesAPI.statsForOne(battle)
    this.setState({ stats, loading: false })
  }

  renderStats () {
    const { t, classes, onClose, battle } = this.props
    const { stats } = this.state
    return (
      <Grid container className={classes.tinyspaced}>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
        <BattlePhotosRow battle={battle} />
        <Grid item xs={12}>
          <Bar
            data={{
              labels: [t('Unknown'), t('Men'), t('Women')],
              datasets: [
                {
                  fillColor: '#1769aa',
                  data: Object.values(stats.byGenders)
                }
              ]
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Button color='primary' variant='contained' onClick={onClose}>
            {t('Close')}
          </Button>
        </Grid>
      </Grid>
    )
  }

  render () {
    const { open, onClose, battle } = this.props
    const { loading } = this.state
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={props => <Slide direction='up' {...props} />}
      >
        <AppBar position='static'>
          <Toolbar>
            <IconButton color='inherit' onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant='title' color='inherit'>
              {innerEllipse(battle.name)}
            </Typography>
          </Toolbar>
        </AppBar>
        {loading ? <LinearProgress color='secondary' /> : this.renderStats()}
      </Dialog>
    )
  }
}

export default withAll(BattleStatsPreviewDialog, {
  withStyles: true,
  withIntl: true
})
