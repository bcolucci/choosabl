import { withRouter as bindRouter } from 'react-router-dom'
import { withStyles as bindStyles } from '@material-ui/core/styles'
import { translate as bindIntl } from 'react-i18next'

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

export default (component, opts = {}) =>
  withRouter(withStyles(withIntl(component, opts.namespaces), opts.styles))
