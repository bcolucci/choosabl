import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
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

    render () {
      const { loading, photos } = this.state
      const { t, classes } = this.props
      const { active, battle } = this.props
      const { onDelete, onPreview } = this.props
      const imgStyle = { height: 120, maxWidth: 140 }
      return (
        <Card className={classes.spaced}>
          <CardContent>
            <Typography color='textSecondary'>{battle.name}</Typography>
            {loading ? (
              <LinearProgress color='secondary' />
            ) : (
              <Grid container style={{ marginTop: '0.5em' }}>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <a onClick={() => onPreview(battle.file1, photos[0])}>
                    <img
                      src={`data:${battle.file1.type};base64,${photos[0]}`}
                      style={imgStyle}
                      alt='bla bla bla 1'
                    />
                  </a>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <a onClick={() => onPreview(battle.file2, photos[1])}>
                    <img
                      src={`data:${battle.file2.type};base64,${photos[1]}`}
                      style={imgStyle}
                      alt='bla bla bla 2'
                    />
                  </a>
                </Grid>
              </Grid>
            )}
            <CardActions>
              <Button
                variant='outlined'
                color='primary'
                onClick={this.handleToggleBattleStatus}
              >
                {active ? <ToggleOffIcon /> : <ToggleOnIcon />}{' '}
                {active ? t('battles:Desactivate') : t('battles:Activate')}
              </Button>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => onDelete(battle)}
              >
                <DeleteIcon />
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      )
    }
  }
)
