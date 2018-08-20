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
  tinyspaced: {
    margin: theme.spacing.unit
  },
  spaced: {
    margin: Math.floor(theme.spacing.unit * 1.5)
  },
  errorBg: {
    backgroundColor: '#E64A19'
  },
  warningBg: {
    backgroundColor: '#FBC02D'
  },
  successBg: {
    backgroundColor: '#388E3C'
  },
  leftCaption: {
    display: 'inline',
    marginLeft: 8
  }
})

const noCustom = () => ({})

export default (opts = { styles: noCustom }) =>
  withStyles(theme => ({
    ...defaultOpts(theme),
    ...opts.styles(theme)
  }))
