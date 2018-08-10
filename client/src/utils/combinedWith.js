import React, { Component } from 'react'
import { withRouter as bindRouter } from 'react-router-dom'
import { withStyles as bindStyles } from '@material-ui/core/styles'
import { translate as bindIntl } from 'react-i18next'
import MsgSnackbar from '../components/MsgSnackbar'

const commonStyles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  spaced: {
    margin: theme.spacing.unit * 2
  }
})

export const withRouter = bindRouter

export const withStyles = (component, custom) =>
  bindStyles(theme => ({
    ...commonStyles(theme),
    ...((custom && custom(theme)) || {})
  }))(component)

export const withIntl = (component, namespaces = []) =>
  bindIntl(['commons', 'langs', ...namespaces])(component)

export const withMsg = WrappedComponent => {
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

console.log(withMsg)

export default (component, opts = {}) =>
  withRouter(
    withStyles(withIntl(withMsg(component), opts.namespaces), opts.styles)
  )
