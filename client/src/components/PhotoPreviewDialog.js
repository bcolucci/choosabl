import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Slide from '@material-ui/core/Slide'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import withAll from '../utils/combinedWith'

const transition = props => <Slide direction='up' {...props} />

export default withAll(
  class extends PureComponent {
    static propTypes = {
      open: PropTypes.bool,
      onClose: PropTypes.func,
      file: PropTypes.object.isRequired,
      base64: PropTypes.string.isRequired
    }

    render () {
      const { open, onClose, file, base64 } = this.props
      if (!file) {
        return null
      }
      return (
        <Dialog
          fullScreen
          open={open}
          onClose={onClose}
          onClick={onClose}
          TransitionComponent={transition}
        >
          <DialogTitle>{file.name}</DialogTitle>
          <img
            src={`data:${file.type};base64,${base64}`}
            style={{ width: '100%', height: 'auto' }}
            alt={file.name}
          />
        </Dialog>
      )
    }
  }
)
