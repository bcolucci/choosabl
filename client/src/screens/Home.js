import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import GalleryDialog from '../components/GalleryDialog'
import withAll from '../utils/with'

class Home extends Component {
  state = {
    showGallery: false
  }

  render () {
    const { classes, user } = this.props
    const { showGallery } = this.state
    console.log(user)
    if (!user) {
      return null
    }
    return (
      <div className={classes.spaced}>
        <GalleryDialog
          open={showGallery}
          onPick={() => window.alert('photo selectionnée')}
          onClose={() => this.setState({ showGallery: false })}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={() => this.setState({ showGallery: true })}
        >
          Open gallery
        </Button>
      </div>
    )
  }
}

export default withAll(Home, {
  withStyles: true
})
