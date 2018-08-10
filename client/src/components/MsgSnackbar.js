import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'

export default class extends Component {
  static propTypes = {
    type: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired
  }

  render () {
    const { t, type, message, onClose } = this.props
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={onClose}
        ContentProps={{ 'aria-describedby': 'message-id' }}
        className={`snackbar-${type}`}
        message={<p id='message-id'>{t(message)}</p>}
      />
    )
  }
}
