import React, { Component } from 'react'
import MsgSnackbar from '../../components/MsgSnackbar'

export default () => WrappedComponent => {
  return class extends Component {
    state = {
      msg: null
    }

    showError = (message, cbk) => {
      this.setState({ msg: { type: 'error', message } })
      this.cbk = cbk
    }

    showSuccess = (message, cbk) => {
      this.setState({ msg: { type: 'success', message } })
      this.cbk = cbk
    }

    closeMsg = () => {
      this.setState({ msg: null })
      if (this.cbk) {
        this.cbk()
      }
    }

    render () {
      const { msg } = this.state
      return (
        <div>
          <WrappedComponent
            {...this.props}
            showError={this.showError}
            showSuccess={this.showSuccess}
            closeMsg={this.closeMsg}
          />
          {msg && (
            <MsgSnackbar
              {...this.props}
              {...msg}
              open
              onClose={this.closeMsg}
            />
          )}
        </div>
      )
    }
  }
}
