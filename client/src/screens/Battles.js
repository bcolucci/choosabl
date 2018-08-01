import React, { PureComponent } from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import withAll from '../utils/combinedWith'

export default withAll(
  class extends PureComponent {
    render () {
      const { t } = this.props
      return (
        <div className='with-padding'>
          <Typography variant='headline'>{t('battles')}</Typography>
          <Divider />
        </div>
      )
    }
  }
)
