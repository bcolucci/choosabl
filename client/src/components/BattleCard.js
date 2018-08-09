import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import withAll from '../utils/combinedWith'
import * as battlesAPI from '../api/battles'

export default withAll(
  class extends Component {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      battle: PropTypes.object.isRequired,
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

    renderPhoto = (file, base64) => {
      const { onPreview } = this.props
      return (
        <Grid item xs={6} style={{ textAlign: 'center' }}>
          <a onClick={() => onPreview(file, base64)}>
            <img
              src={`data:${file.type};base64,${base64}`}
              style={{ height: 120, maxWidth: 140 }}
              alt={file.name}
            />
          </a>
        </Grid>
      )
    }

    render () {
      const { loading, photos } = this.state
      const { t, classes } = this.props
      const { active, battle } = this.props
      const { onDelete } = this.props
      return (
        <Card className={classes.spaced}>
          <CardContent>
            <Typography variant='headline' gutterBottom>
              {battle.name}
            </Typography>
            <Divider />
            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <CircularProgress
                  color='primary'
                  style={{ margin: '50px 0' }}
                />
              </div>
            ) : (
              <Grid container style={{ marginTop: '0.5em' }}>
                {this.renderPhoto(battle.file1, photos[0])}
                {this.renderPhoto(battle.file2, photos[1])}
              </Grid>
            )}
            <CardActions>
              <Button
                variant='outlined'
                color='primary'
                onClick={this.handleToggleBattleStatus}
              >
                {active ? (
                  <ToggleOffIcon color='secondary' />
                ) : (
                  <ToggleOnIcon />
                )}{' '}
                {active ? t('battles:Desactivate') : t('battles:Activate')}
              </Button>
              {!active && (
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => onDelete(battle)}
                >
                  <DeleteIcon />
                </Button>
              )}
            </CardActions>
          </CardContent>
        </Card>
      )
    }
  }
)
