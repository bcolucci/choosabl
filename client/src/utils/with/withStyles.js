import { withStyles } from '@material-ui/core/styles'
import defaultStyles from './_defaultStyles'

export default (opts = { styles: () => ({}) }) =>
  withStyles(theme => ({
    ...defaultStyles(theme),
    ...opts.styles(theme)
  }))
