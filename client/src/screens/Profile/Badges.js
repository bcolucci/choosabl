import React, { Component } from 'react'
import { EventEmitter } from 'events'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import withAll from '../../utils/with'
import * as profilesAPI from '../../api/profiles'

class Badges extends Component {
  state = {
    stats: null,
    loading: true
  }

  constructor (props) {
    super(props)
    this.customListener = new EventEmitter()
  }

  componentDidMount () {
    this.customListener.on('statsLoaded', this._handleStatsLoaded)
    this.loadStats()
  }

  componentWillUnmount () {
    this.customListener.removeAllListeners()
  }

  _handleStatsLoaded = stats => this.setState({ stats, loading: false })

  async loadStats () {
    const stats = await profilesAPI.currentProfileStats()
    this.customListener.emit('statsLoaded', stats)
  }

  renderVotesInfo () {
    const { classes } = this.props
    const { votes } = this.state.stats
    return (
      <Paper className={classes.paper} elevation={1}>
        <Typography variant='h5' component='h3'>
          Votes:
          <strong>{votes.remaining}</strong>
        </Typography>
        <Typography component='p'>
          You've received <strong>{votes.received}</strong> votes, for{' '}
          <strong>{votes.given}</strong> given.
        </Typography>
      </Paper>
    )
  }

  renderBattlesInfo () {
    const { classes } = this.props
    const { battles } = this.state.stats
    return (
      <Paper className={classes.paper} elevation={1}>
        <Typography variant='h5' component='h3'>
          Battles:
          <strong>{battles.total}</strong>
        </Typography>
        <Typography component='p'>
          With <strong>{battles.actives}</strong> active battles and{' '}
          <strong>{battles.draft}</strong> drafts.
        </Typography>
      </Paper>
    )
  }

  render () {
    const { loading } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    return (
      <div>
        {this.renderBattlesInfo()}
        {this.renderVotesInfo()}
      </div>
    )
  }
}

export default withAll(Badges, {
  withIntl: true,
  withStyles: true
})
