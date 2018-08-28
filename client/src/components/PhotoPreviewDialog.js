import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import withAll from '../utils/with'

const truncateName = name => {
  const trimExt = name
    .split('.')
    .reverse()
    .slice(1)
    .reverse()
    .join('.')
  const toRem = trimExt.length - 23
  return !toRem
    ? trimExt
    : trimExt.substr(0, 12) + '[...]' + trimExt.substr(15 + toRem)
}

class PhotoPreviewDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    battle: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    base64: PropTypes.string.isRequired
  }

  constructor (props) {
    super({ ...props, filename: truncateName(props.file.name) })
  }

  render () {
    const { classes, open, onClose } = this.props
    const { file, filename, base64 } = this.props
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={props => <Slide direction='up' {...props} />}
      >
        <AppBar position='static'>
          <Toolbar>
            <IconButton color='inherit' onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant='title' color='inherit'>
              Preview "{filename}"
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.tinyspaced}>
          <img
            alt='preview battle file'
            src={`data:${file.type};base64,${base64}`}
            style={{ width: '100%' }}
          />
          <Button color='primary' variant='contained' onClick={onClose}>
            Close
          </Button>
        </div>
      </Dialog>
    )
  }
}

export default withAll(PhotoPreviewDialog, {
  withStyles: true
})
