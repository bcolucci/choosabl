import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
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
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import withAll from '../utils/with'
import * as battlesAPI from '../api/battles'

class BattleCard extends Component {
  static propTypes = {
    battle: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    deleting: PropTypes.bool,
    moveBattle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired
  }

  state = {
    photos: null,
    loading: true
  }

  async componentWillMount () {
    const { battle } = this.props
    const photos = await battlesAPI.downloadPhotos(battle)
    this.setState({ photos, loading: false })
  }

  handleToggleBattleStatus = () => {
    const { battle, moveBattle } = this.props
    battlesAPI.toggleBattleStatus(battle)
    moveBattle(battle)
  }

  renderPhoto = num => {
    const { battle, onPreview } = this.props
    const { photos } = this.state
    const file = battle[`file${num + 1}`]
    const base64 = photos[num]
    return (
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <a onClick={() => onPreview({ num, battle, file, base64 })}>
          <img
            src={`data:${file.type};base64,${base64}`}
            style={{ height: 120, maxWidth: 140 }}
            alt={file.name}
          />
        </a>
      </Grid>
    )
  }

  renderDeletingText () {
    const { classes } = this.props
    return (
      <Typography
        gutterBottom
        variant='caption'
        align='center'
        className={classes.leftCaption}
      >
        deleting...
      </Typography>
    )
  }

  renderActions () {
    const { t } = this.props
    const { active, deleting, battle } = this.props
    const { onDelete } = this.props
    return (
      <div>
        <Button
          variant='outlined'
          color='primary'
          onClick={this.handleToggleBattleStatus}
        >
          {active ? <ToggleOffIcon color='secondary' /> : <ToggleOnIcon />}{' '}
          {active ? t('battles:Desactivate') : t('battles:Activate')}
        </Button>
        {!active &&
          (deleting ? (
            this.renderDeletingText()
          ) : (
            <Button
              variant='outlined'
              color='secondary'
              style={{ marginLeft: 5 }}
              onClick={() =>
                window.confirm('Are you sure?') && onDelete(battle)
              }
            >
              <DeleteIcon />
            </Button>
          ))}
      </div>
    )
  }

  render () {
    const { loading } = this.state
    const { classes } = this.props
    const { battle } = this.props
    return (
      <Card className={classes.spaced}>
        <CardHeader
          title={<Typography variant='title'>{battle.name}</Typography>}
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
            <Grid container>
              {this.renderPhoto(0)}
              {this.renderPhoto(1)}
            </Grid>
          )}
          <CardActions>{this.renderActions()}</CardActions>
        </CardContent>
      </Card>
    )
  }
}

export default withAll(BattleCard, {
  withStyles: true,
  withIntl: true
})
