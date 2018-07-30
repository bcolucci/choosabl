import React, { Component } from 'react'
import withAll from '../utils/combinedWith'

export default withAll(
  class extends Component {
    render () {
      const { t, user } = this.props
      return (
        <div>
          <h2>{t('my-account')}</h2>
          <p>{user.email}</p>
        </div>
      )
    }
  }
)
