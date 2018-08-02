import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import withAll from '../../utils/combinedWith'

export default withAll(
  class extends Component {
    static propTypes = {
      active: PropTypes.bool
    }

    static defaultProps = {
      active: false
    }

    render () {
      const { t, active } = this.props
      return (
        <div className='with-padding'>
          <Typography variant='headline'>
            {t(`battles:${active ? 'active' : 'draft'}Battles`)}
          </Typography>
          <Divider />
          <Typography component='div'>
            list {active ? 'active' : 'draft'} battles
          </Typography>
        </div>
      )
    }
  },
  {
    namespaces: ['battles']
  }
)
