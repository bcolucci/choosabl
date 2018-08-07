import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import withAll from '../utils/combinedWith'
import { toggleBattleStatus } from '../api/battles'

export default withAll(
  class extends Component {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      battle: PropTypes.object.isRequired,
      moveBattle: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired
    }

    handleToggleBattleStatus = () => {
      const { battle, moveBattle } = this.props
      toggleBattleStatus(battle)
      moveBattle(battle)
    }

    render () {
      const { t, classes } = this.props
      const { active, battle } = this.props
      const { onDelete } = this.props
      const imgStyle = {
        width: '98%',
        height: '100px',
        border: '1px solid #666'
      }
      return (
        <div className={classes.root + ' with-padding'}>
          <Card>
            <CardContent>
              <Typography color='textSecondary'>{battle.name}</Typography>
              <Grid container style={{ marginTop: '0.5em' }}>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <img src='#' style={imgStyle} alt='bla bla bla 1' />
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <img src='#' style={imgStyle} alt='bla bla bla 2' />
                </Grid>
              </Grid>
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
        </div>
      )
    }
  }
)
