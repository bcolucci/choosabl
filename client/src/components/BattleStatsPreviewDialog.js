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

class BattleStatsPreviewDialog extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    battle: PropTypes.object.isRequired
  }

  render () {
    const { classes, open, onClose, battle } = this.props
    console.log(battle)
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
              {innerEllipse(battle.name)}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.tinyspaced}>
          <p>TODO</p>
          <Button color='primary' variant='contained' onClick={onClose}>
            Close
          </Button>
        </div>
      </Dialog>
    )
  }
}

export default withAll(BattleStatsPreviewDialog, {
  withStyles: true,
  withIntl: ['battles']
})
