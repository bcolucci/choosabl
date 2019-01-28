import React, { Component } from 'react'
import { EventEmitter } from 'events'
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

  constructor (props) {
    super(props)
    this.customListener = new EventEmitter()
  }

  componentWillReceiveProps ({ open }) {
    this.setState({ open })
  }

  componentDidMount () {
    const { timeout } = this.props
    this.customListener.on('timeout', () => this.setState({ open: false }))
    setTimeout(() => this.customListener.emit('timeout'), Math.max(0, +timeout))
  }

  componentWillUnmount () {
    this.customListener.removeAllListeners()
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
