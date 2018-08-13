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
    deleted: []
  }

  handleDeleteBattle = battle => {
    battlesAPI.deleteOne(battle)
    this.props.moveBattle(battle, true)
    this.setState({ deleted: [...this.state.deleted, battle.id] })
  }

  handlePreview = (file, base64) => this.setState({ preview: { file, base64 } })

  render () {
    const { preview, deleted } = this.state
    const { active, battles, moveBattle } = this.props
    return (
      <section>
        {battles
          .filter(battle => !deleted.includes(battle.id))
          .map((battle, idx) => (
            <BattleCard
              key={idx}
              active={active}
              battle={battle}
              moveBattle={moveBattle}
              onDelete={this.handleDeleteBattle}
              onPreview={this.handlePreview}
            />
          ))}
        {preview && (
          <PhotoPreviewDialog
            open={!!preview}
            file={preview.file}
            base64={preview.base64}
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
