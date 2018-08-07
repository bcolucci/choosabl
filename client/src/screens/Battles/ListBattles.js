import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Divider from '@material-ui/core/Divider'
// import Typography from '@material-ui/core/Typography'
import BattleCard from '../../components/BattleCard'
import withAll from '../../utils/combinedWith'
import { deleteOne } from '../../api/battles'

export default withAll(
  class extends Component {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      battles: PropTypes.array.isRequired,
      moveBattle: PropTypes.func.isRequired
    }

    state = {
      deleted: []
    }

    handleDeleteBattle = async battle => {
      deleteOne(battle)
      this.props.moveBattle(battle, true)
      this.setState({ deleted: [...this.state.deleted, battle.id] })
    }

    render () {
      const { deleted } = this.state
      const { t, active, battles, moveBattle } = this.props
      return (
        <div className='with-padding'>
          {/* <Typography variant='headline'>
            {t(`battles:${active ? 'active' : 'draft'}Battles`)}
          </Typography>
          <Divider /> */}
          {battles
            .filter(battle => !deleted.includes(battle.id))
            .map((battle, idx) => (
              <BattleCard
                key={idx}
                active={active}
                battle={battle}
                moveBattle={moveBattle}
                onDelete={this.handleDeleteBattle}
              />
            ))}
        </div>
      )
    }
  },
  {
    namespaces: ['battles']
  }
)
