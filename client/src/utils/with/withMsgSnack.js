import React, { Component } from 'react'
import MsgSnackbar from '../../components/MsgSnackbar'

export default () => WrappedComponent => {
  return class extends Component {
    state = {
      msg: null
    }

    showErr (message) {
      this.setState({ msg: { type: 'error', message } })
    }

    showSuccess (message) {
      this.setState({ msg: { type: 'success', message } })
    }

    closeMsg () {
      this.setState({ msg: null })
    }

    render () {
      const { msg } = this.state
      const onClose = this.closeMsg.bind(this)
      return (
        <div>
          <WrappedComponent
            {...this.props}
            showErr={this.showErr.bind(this)}
            showSuccess={this.showSuccess.bind(this)}
            closeMsg={onClose}
          />
          {msg && <MsgSnackbar {...this.props} {...msg} onClose={onClose} />}
        </div>
      )
    }
  }
}
