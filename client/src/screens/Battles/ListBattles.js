import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import BattleCard from '../../components/BattleCard'
import withAll from '../../utils/combinedWith'

export default withAll(
  class extends Component {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      battles: PropTypes.array.isRequired
    }

    render () {
      const { t, active, battles } = this.props
      return (
        <div className='with-padding'>
          <Typography variant='headline'>
            {t(`battles:${active ? 'active' : 'draft'}Battles`)}
          </Typography>
          <Divider />
          {battles.map((battle, idx) => (
            <BattleCard key={idx} battle={battle} />
          ))}
        </div>
      )
    }
  },
  {
    namespaces: ['battles']
  }
)
