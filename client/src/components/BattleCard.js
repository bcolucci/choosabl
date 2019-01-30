import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import PersoIcon from '@material-ui/icons/InsertEmoticon'
import WorkIcon from '@material-ui/icons/Work'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import PollIcon from '@material-ui/icons/Poll'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import BattlePhotosRow from './BattlePhotosRow'
import withAll from '../utils/with'
import * as battlesAPI from '../api/battles'

class BattleCard extends Component {
  static propTypes = {
    battle: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    deleting: PropTypes.bool,
    moveBattle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired,
    onStats: PropTypes.func.isRequired
  }

  state = {
    loading: false,
    moving: false
  }

  handleToggleBattleStatus = async () => {
    const { events, battle, moveBattle } = this.props
    this.setState({ moving: true })
    await battlesAPI.toggleBattleStatus(battle)
    events.update(battle.active ? 'desactivate' : 'activate', battle.id)
    this.setState({ moving: false })
    moveBattle(battle)
  }

  renderFloatingText (text) {
    const { classes } = this.props
    return (
      <Typography
        gutterBottom
        variant='caption'
        align='center'
        className={classes.leftCaption}
      >
        {text}
      </Typography>
    )
  }

  renderActions () {
    const { t } = this.props
    const { active, deleting, battle } = this.props
    const { onDelete, onStats } = this.props
    const { moving } = this.state
    return (
      <div>
        {moving ? (
          this.renderFloatingText(t('saving...'))
        ) : (
          <Button
            ga-on='click'
            ga-event-category='Battle'
            ga-event-action='toggle'
            variant='outlined'
            color='primary'
            onClick={this.handleToggleBattleStatus}
          >
            {active ? <ToggleOffIcon color='secondary' /> : <ToggleOnIcon />}{' '}
            {active ? t('battles:Desactivate') : t('battles:Activate')}
          </Button>
        )}
        {!active &&
          (deleting ? (
            this.renderFloatingText(t('deleting...'))
          ) : (
            <Button
              variant='outlined'
              color='secondary'
              style={{ marginLeft: 5 }}
              onClick={() =>
                window.confirm(t('Are you sure?')) && onDelete(battle)
              }
            >
              <DeleteIcon />
            </Button>
          ))}
        {active && (
          <Button
            variant='outlined'
            color='primary'
            style={{ marginLeft: 5 }}
            onClick={() => onStats(battle)}
          >
            <PollIcon />
            {t('battles:Stats')}
          </Button>
        )}
      </div>
    )
  }

  render () {
    const { loading } = this.state
    const { classes, onPreview, battle } = this.props
    return (
      <Card className={classes.spaced}>
        <CardHeader
          title={<Typography variant='h6'>{battle.name}</Typography>}
          avatar={
            <Avatar>{battle.isPro ? <WorkIcon /> : <PersoIcon />}</Avatar>
          }
        />
        <CardContent style={{ paddingTop: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <LinearProgress color='secondary' style={{ margin: '45px 0' }} />
            </div>
          ) : (
            <BattlePhotosRow battle={battle} onClick={onPreview} />
          )}
          <CardActions>{this.renderActions()}</CardActions>
        </CardContent>
      </Card>
    )
  }
}

export default withAll(BattleCard, {
  withStyles: true,
  withIntl: true,
  withTracker: true
})
