import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'

class MsgSnackbar extends Component {
  static propTypes = {
    open: PropTypes.bool,
    type: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClose: PropTypes.func.isRequired,
    timeout: PropTypes.number
  }

  static defaultProps = {
    timeout: 4000
  }

  state = {
    open: true
  }

  componentWillReceiveProps ({ open }) {
    this.setState({ open })
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  componentDidMount () {
    const { timeout } = this.props
    setTimeout(
      () => !this.unmounted && this.setState({ open: false }),
      Math.max(0, +timeout)
    )
  }

  render () {
    const { open } = this.state
    const { type, message, onClose } = this.props
    return (
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={onClose}
        ContentProps={{ 'aria-describedby': 'message-id' }}
        className={`${type}Bg`}
        message={<p id='message-id'>{message}</p>}
      />
    )
  }
}

export default MsgSnackbar
