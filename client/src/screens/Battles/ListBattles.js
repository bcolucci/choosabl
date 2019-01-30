import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import BattleCard from '../../components/BattleCard'
import PhotoPreviewDialog from '../../components/PhotoPreviewDialog'
import BattleStatsPreviewDialog from '../../components/BattleStatsPreviewDialog'
import * as battlesAPI from '../../api/battles'

class ListBattles extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    battles: PropTypes.array.isRequired,
    moveBattle: PropTypes.func.isRequired
  }

  state = {
    preview: null,
    showStats: null,
    deleting: [],
    deleted: []
  }

  handleDeleteBattle = async battle => {
    const { events, moveBattle } = this.props
    this.setState(prev => ({ deleting: [...prev.deleting, battle.id] }))
    await battlesAPI.deleteOne(battle)
    events.delete(battle.id)
    moveBattle(battle, true)
    this.setState(prev => ({ deleted: [...prev.deleted, battle.id] }))
  }

  handleStats = battle => this.setState({ showStats: battle })

  handlePreview = preview => this.setState({ preview })

  render () {
    const { preview, showStats, deleting, deleted } = this.state
    const { classes, active, battles, moveBattle } = this.props
    return (
      <Grid container>
        <Grid item xs={12} sm={8} md={4} lg={3} className={classes.spaced}>
          {battles
            .filter(battle => !deleted.includes(battle.id))
            .map((battle, idx) => (
              <BattleCard
                key={idx}
                active={active}
                deleting={deleting.includes(battle.id)}
                battle={battle}
                moveBattle={moveBattle}
                onDelete={this.handleDeleteBattle}
                onPreview={this.handlePreview}
                onStats={this.handleStats}
              />
            ))}
          {!!showStats && (
            <BattleStatsPreviewDialog
              open
              battle={showStats}
              onClose={() => this.setState({ showStats: null })}
            />
          )}
          {!!preview && (
            <PhotoPreviewDialog
              open
              {...preview}
              onClose={() => this.setState({ preview: null })}
            />
          )}
        </Grid>
      </Grid>
    )
  }
}

export default ListBattles
