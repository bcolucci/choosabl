export default theme => ({
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
  tab: {
    paddingTop: '5px'
  },
  leftCaption: {
    display: 'inline',
    margin: '0px 8px'
  }
})
