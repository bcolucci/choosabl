import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import innerEllipse from '../utils/innerEllipse'
import withAll from '../utils/with'

class PhotoPreviewDialog extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    battle: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    base64: PropTypes.string.isRequired
  }

  render () {
    const { t, classes, open, onClose } = this.props
    const { file, base64 } = this.props
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
              {innerEllipse(file.name)}
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
            {t('Close')}
          </Button>
        </div>
      </Dialog>
    )
  }
}

export default withAll(PhotoPreviewDialog, {
  withStyles: true
})
