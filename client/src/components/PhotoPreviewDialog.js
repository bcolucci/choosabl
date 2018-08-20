import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { storage } from 'firebase'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import withAll from '../utils/with'

const transition = props => <Slide direction='up' {...props} />

class PhotoPreviewDialog extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    num: PropTypes.number.isRequired,
    battle: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    base64: PropTypes.string.isRequired
  }

  state = {
    toggle: null,
    faces: null,
    showFaces: false
  }

  constructor (props) {
    super(props)
    this.dev = window.location.host === 'localhost:3000'
  }

  async componentWillMount () {
    if (this.dev) {
      this.downloadFaces()
    }
  }

  async downloadFaces () {
    const { num, battle } = this.props
    const facesPath = battle[`photo${num + 1}Path`].replace(
      'photos/',
      'vision/'
    )
    const url = await storage()
      .ref(facesPath)
      .getDownloadURL()
    const results = await (await fetch(url)).json()
    this.setState({ faces: results })
  }

  drawPhoto = () => {
    const { file, base64 } = this.props
    const { faces, showFaces } = this.state
    const canvas = window.document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = `data:${file.type};base64,${base64}`
    img.onload = () => {
      setTimeout(() => {
        const width = Math.max(450, Math.min(450, img.width))
        const ratio = width / img.width
        const height = Math.ceil(img.height * ratio)
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height)
        if (!showFaces) {
          return
        }
        const [{ faceAnnotations }] = faces
        ctx.strokeStyle = 'rgba(255,0,0,0.8)'
        ctx.lineWidth = '3'
        faceAnnotations.forEach(face => {
          ctx.beginPath()
          let ox = 0
          let oy = 0
          face.boundingPoly.vertices.forEach((p, i) => {
            const x = Math.ceil(p.x * ratio)
            const y = Math.ceil(p.y * ratio)
            if (i === 0) {
              ox = x
              oy = y
            }
            ctx.lineTo(x, y)
          })
          ctx.lineTo(ox, oy)
          ctx.stroke()
        })
      }, 300)
    }
  }

  renderLoadingFaces () {
    const { classes } = this.props
    return (
      <Typography
        gutterBottom
        variant='caption'
        align='center'
        className={classes.leftCaption}
      >
        loading faces...
      </Typography>
    )
  }

  render () {
    const { classes, open, onClose } = this.props
    const { file } = this.props
    const { faces, showFaces } = this.state
    if (!file) {
      return null
    }
    const truncTitle = (() => {
      const withoutExt = file.name
        .split('.')
        .reverse()
        .slice(1)
        .reverse()
        .join('.')
      const toRemove = withoutExt.length - 25
      return !toRemove
        ? withoutExt
        : withoutExt.substr(0, 12) + '[...]' + withoutExt.substr(15 + toRemove)
    })()
    setImmediate(this.drawPhoto)
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={transition}
      >
        <AppBar position='static'>
          <Toolbar>
            <IconButton color='inherit' onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant='title' color='inherit'>
              Preview "{truncTitle}"
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.tinyspaced}>
          <div style={{ textAlign: 'center' }}>
            <canvas />
          </div>
          <Button color='primary' variant='contained' onClick={onClose}>
            Close
          </Button>
          {this.dev &&
            (!faces ? (
              this.renderLoadingFaces()
            ) : (
              <Button
                color={showFaces ? 'default' : 'primary'}
                variant='contained'
                onClick={() => this.setState({ showFaces: !showFaces })}
                style={{ marginLeft: 5 }}
              >
                Show faces
              </Button>
            ))}
        </div>
      </Dialog>
    )
  }
}

export default withAll(PhotoPreviewDialog, {
  withStyles: true
})
