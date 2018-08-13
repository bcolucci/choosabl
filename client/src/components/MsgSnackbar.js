import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles from '../utils/with/withStyles'

class MsgSnackbar extends Component {
  static propTypes = {
    type: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired
  }

  render () {
    const { classes, type, message, onClose } = this.props
    return (
      <Snackbar
        open
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={onClose}
        ContentProps={{ 'aria-describedby': 'message-id' }}
        className={`${type}Bg`}
        message={<p id='message-id'>{message}</p>}
      />
    )
  }
}

export default withStyles()(MsgSnackbar)
