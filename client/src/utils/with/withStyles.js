import { withStyles } from '@material-ui/core/styles'

const defaultOpts = theme => ({
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
  },
  errorBg: {
    backgroundColor: '#E64A19'
  },
  successBg: {
    backgroundColor: '#388E3C'
  }
})

const noCustom = () => ({})

export default (opts = { styles: noCustom }) =>
  withStyles(theme => ({
    ...defaultOpts(theme),
    ...opts.styles(theme)
  }))
