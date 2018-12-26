import React, { Component } from 'react'
import classnames from 'classnames'
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
import { Pie, Bar } from 'react-chartjs-2'
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

  // TODO rm
  fakeStats () {
    return {
      total: 1233,
      unknown: 200,
      man: 800,
      woman: 233,
      photo1: {
        total: 383,
        unknown: 50,
        man: 300,
        woman: 33
      },
      photo2: {
        total: 850,
        unknown: 150,
        man: 500,
        woman: 200
      }
    }
  }

  barChartData () {
    const { t } = this.props
    const { stats } = this.state
    // const stats = this.fakeStats()
    return {
      labels: [t('Total'), t('Man'), t('Woman'), t('Unknown')],
      datasets: [
        {
          label: t('Total'),
          backgroundColor: '#1769aa',
          data: [stats.total, stats.man, stats.woman, stats.unknown]
        },
        {
          label: t('Photo 1'),
          backgroundColor: '#3370ff',
          data: [
            stats.photo1.total,
            stats.photo1.man,
            stats.photo1.woman,
            stats.photo1.unknown
          ]
        },
        {
          label: t('Photo 2'),
          backgroundColor: '#5c85e6',
          data: [
            stats.photo2.total,
            stats.photo2.man,
            stats.photo2.woman,
            stats.photo2.unknown
          ]
        }
      ]
    }
  }

  genderPieChart (num) {
    const { t } = this.props
    const { stats } = this.state
    // const stats = this.fakeStats()
    const photoStats = stats[`photo${num}`]
    if (photoStats.total === 0) {
      return <Typography variant='caption'>{t('No vote yet.')}</Typography>
    }
    const data = {
      labels: [t('Man'), t('Woman'), t('Unknown')],
      datasets: [
        {
          data: [photoStats.man, photoStats.woman, photoStats.unknown],
          backgroundColor: ['#36A2EB', '#FF6384', '#CCC'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384', '#CCC']
        }
      ]
    }
    return <Pie width={180} data={data} />
  }

  renderContents () {
    const { t, classes, onClose, battle } = this.props
    const { stats } = this.state
    // const stats = this.fakeStats()
    const winner =
      stats.photo1.total === stats.photo2.total
        ? 'none'
        : stats.photo1.total > stats.photo2.total ? 1 : 2
    return (
      <div className={classnames(classes.tinyspaced, 'stats')}>
        <BattlePhotosRow battle={battle} />
        <img
          src='/gold-medal.png'
          alt='Gold medal for the bests'
          className={classnames({
            'battle-result-medal': true,
            'push-left': winner === 2
          })}
        />
        <Grid container>
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            {this.genderPieChart(1)}
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            {this.genderPieChart(2)}
          </Grid>
        </Grid>
        <Grid container className={classes.tinyspaced}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Bar data={this.barChartData()} />
          </Grid>
          <Grid item xs={12} className={classes.spaced}>
            <Button color='primary' variant='contained' onClick={onClose}>
              {t('Close')}
            </Button>
          </Grid>
        </Grid>
      </div>
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
            <Typography variant='h6' color='inherit'>
              {innerEllipse(battle.name)}
            </Typography>
          </Toolbar>
        </AppBar>
        {loading ? <LinearProgress color='secondary' /> : this.renderContents()}
      </Dialog>
    )
  }
}

export default withAll(BattleStatsPreviewDialog, {
  withStyles: true,
  withIntl: true
})
