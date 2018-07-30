import { withRouter as bindRouter } from 'react-router-dom'
import { withStyles as bindStyles } from '@material-ui/core/styles'
import { translate as bindIntl } from 'react-i18next'

export const withRouter = bindRouter

export const withStyles = (component, styles = {}) =>
  bindStyles({
    root: {
      flexGrow: 1
    },
    flex: {
      flexGrow: 1
    },
    ...styles
  })(component)

export const withIntl = (component, namespaces = []) =>
  bindIntl(['commons', ...namespaces])(component)

export default (component, opts = {}) =>
  withRouter(withStyles(withIntl(component, opts.namespaces), opts.styles))
