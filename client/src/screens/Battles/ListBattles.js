import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withAll from '../../utils/with'
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
    this.setState(prev => ({ deleting: [...prev.deleting, battle.id] }))
    await battlesAPI.deleteOne(battle)
    this.props.moveBattle(battle, true)
    this.setState(prev => ({ deleted: [...prev.deleted, battle.id] }))
  }

  handleStats = battle => this.setState({ showStats: battle })

  handlePreview = preview => this.setState({ preview })

  render () {
    const { preview, showStats, deleting, deleted } = this.state
    const { active, battles, moveBattle } = this.props
    return (
      <section>
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
      </section>
    )
  }
}

export default withAll(ListBattles, {
  withIntl: true
})
