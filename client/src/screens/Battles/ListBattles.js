import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withAll from '../../utils/with'
import BattleCard from '../../components/BattleCard'
import PhotoPreviewDialog from '../../components/PhotoPreviewDialog'
import * as battlesAPI from '../../api/battles'

class ListBattles extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    battles: PropTypes.array.isRequired,
    moveBattle: PropTypes.func.isRequired
  }

  state = {
    preview: null,
    deleting: [],
    deleted: []
  }

  handleDeleteBattle = async battle => {
    const { deleting, deleted } = this.state
    this.setState({ deleting: [...deleting, battle.id] })
    await battlesAPI.deleteOne(battle)
    this.props.moveBattle(battle, true)
    this.setState({ deleted: [...deleted, battle.id] })
  }

  handlePreview = preview => this.setState({ preview })

  render () {
    const { preview, deleting, deleted } = this.state
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
            />
          ))}
        {preview && (
          <PhotoPreviewDialog
            open={!!preview}
            {...preview}
            onClose={() => this.setState({ preview: null })}
          />
        )}
      </section>
    )
  }
}

export default withAll(ListBattles, {
  withIntl: ['battles']
})
