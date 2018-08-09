import React, { Component } from 'react'
import PropTypes from 'prop-types'
import BattleCard from '../../components/BattleCard'
import withAll from '../../utils/combinedWith'
import PhotoPreviewDialog from '../../components/PhotoPreviewDialog'
import * as battlesAPI from '../../api/battles'

export default withAll(
  class extends Component {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      battles: PropTypes.array.isRequired,
      moveBattle: PropTypes.func.isRequired
    }

    state = {
      preview: null,
      deleted: []
    }

    handleDeleteBattle = async battle => {
      battlesAPI.deleteOne(battle)
      this.props.moveBattle(battle, true)
      this.setState({ deleted: [...this.state.deleted, battle.id] })
    }

    handlePreview = (file, base64) =>
      this.setState({ preview: { file, base64 } })

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
  },
  {
    namespaces: ['battles']
  }
)
