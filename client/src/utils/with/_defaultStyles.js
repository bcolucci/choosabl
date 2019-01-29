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
    margin: '10px 5px'
  },
  paper: {
    ...theme.mixins.gutters(),
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit
  },
  btn: {
    padding: '5px 16px',
    color: '#1769aa',
    border: '1px solid #1769aa',
    lineHeight: 1.75,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    borderRadius: 4,
    letterSpacing: '0.02857em',
    textTransform: 'uppercase'
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
