import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { auth, storage } from 'firebase'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import FileInput from 'react-simple-file-input'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Toolbar from '@material-ui/core/Toolbar'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import SelectIcon from '@material-ui/icons/RecentActors'
import AddIcon from '@material-ui/icons/AddCircle'
import withAll from '../utils/with'
import photoPath from '../utils/photoPath'
import * as base64Img from '../utils/base64Img'
import * as photosAPI from '../api/photos'

import 'react-image-crop/dist/ReactCrop.css'

const aspect = 3.7 / 4
const photoWidth = 250
const maxPhotoSize = 600 * 1000 // 600kB

const isTypeImage = type => /^image\//.test(type)

const defaultCrop = () => ({
  x: 0,
  y: 0,
  width: 100,
  aspect
})

class GaleryDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onPick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    tab: 'select',
    step: 0,
    photos: [],
    loading: true,
    // ---
    file: null,
    customName: '',
    base64: null,
    tmpPath: null,
    // ---
    crop: defaultCrop(),
    pixelCrop: null,
    cropBase64: null,
    // ---
    face: null,
    detectingFace: false,
    // ---
    saving: false
  }

  componentWillMount () {
    this.loadPhotos()
  }

  async loadPhotos () {
    this.setState({ loading: true })
    const photos = await photosAPI.getForCurrentUser()
    this.setState({ photos, loading: false })
  }

  steps () {
    return ['Select a photo', 'Crop it!', 'Face detection']
  }

  moveToStep = (inc, updateAttrs = () => ({})) => () => {
    const { step } = this.state
    this.setState({ step: step + inc, ...updateAttrs() })
  }

  renderSelectTab () {
    const { classes } = this.props
    const { photos } = this.state
    if (!photos.length) {
      return (
        <Typography
          variant='subheading'
          className={classes.spaced}
          gutterBottom
        >
          No photo imported yet.
        </Typography>
      )
    }
    return (
      <ul className={classes.spaced}>
        {photos.map((photo, idx) => (
          <li key={idx}>
            <Typography>{photo.name}</Typography>
            <Typography variant='caption'>{photo.customName}</Typography>
          </li>
        ))}
      </ul>
    )
  }

  handleUploadProgress = async ({ loaded, total, target }) => {
    if (loaded < total) {
      return
    }
    const { file } = this.state
    const base64 = Buffer.from(target.result).toString('base64')
    const { width } = await base64Img.getDimensions({ type: file.type, base64 })
    if (width < photoWidth) {
      this.showWidthValidationError()
      this.setState(this.resetImage())
      return
    }
    this.setState({ base64 })
  }

  extractCropBase64 = async crop => {
    const { file, base64 } = this.state
    return await base64Img.crop({ type: file.type, base64, ...crop })
  }

  handleDetectFace = async () => {
    this.setState({ detectingFace: true })
    const { file, cropBase64, tmpPath } = this.state
    const { showError } = this.props
    const { uid } = auth().currentUser
    const path = photoPath(uid, file.name)
    const rawBase64 = cropBase64.split('base64,').pop()
    try {
      if (tmpPath) {
        storage()
          .ref(tmpPath)
          .delete()
      }
      await storage()
        .ref(path)
        .putString(rawBase64, 'base64')
      const face = await photosAPI.detectingFace(path)
      if (!Object.keys(face).length) {
        throw new Error('No face detected.')
      }
      this.setState({ face, tmpPath: path })
    } catch (err) {
      showError(err.message)
    }
    this.setState({ detectingFace: false })
  }

  showWidthValidationError () {
    if (this.widthErrOpened) {
      return
    }
    const { showError } = this.props
    this.widthErrOpened = true
    showError(
      `Photo is too small. Must be >= ${photoWidth}px.`,
      () => (this.widthErrOpened = false)
    )
  }

  isValideImage ({ type, size }) {
    const { showError } = this.props
    if (!isTypeImage(type)) {
      showError('Invalid image.')
      return false
    }
    if (size > maxPhotoSize) {
      showError(`Image size should be <= ${maxPhotoSize}kB`)
      return false
    }
    return true
  }

  resetImage () {
    return {
      file: null,
      customName: '',
      pixelCrop: null,
      base64: null,
      cropBase64: null,
      face: null,
      faceDetected: false
    }
  }

  drawPhoto = () => {
    const { file, cropBase64, face } = this.state
    const canvas = window.document.querySelector('canvas#face')
    const img = new Image()
    img.src = `data:${file.type};base64,${cropBase64}`
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      if (!face) {
        return
      }
      ctx.strokeStyle = 'rgba(100,200,100,0.8)'
      ctx.lineWidth = '5'
      ctx.beginPath()
      let ox = 0
      let oy = 0
      const { boundingPoly } = face
      boundingPoly.vertices.forEach((p, i) => {
        if (i === 0) {
          ox = p.x
          oy = p.y
        }
        ctx.lineTo(p.x, p.y)
      })
      ctx.lineTo(ox, oy)
      ctx.stroke()
    }
  }

  renderSelectStep () {
    const { classes } = this.props
    const { customName, file, base64 } = this.state
    return (
      <Grid container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography>Give it a name:</Typography>
          <TextField
            autoFocus
            required
            fullWidth
            value={customName}
            onChange={({ target }) =>
              this.setState({ customName: target.value.substr(0, 50) })
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Typography>Select a photo:</Typography>
          <FileInput
            required
            readAs='buffer'
            onProgress={this.handleUploadProgress}
            abortIf={(_, file) => !this.isValideImage(file)}
            onChange={file => {
              if (!file || !this.isValideImage(file)) {
                this.setState(this.resetImage())
                return window.document.querySelector('input[type=file]').focus()
              }
              this.setState({ file })
            }}
          />
        </Grid>
        {base64 && (
          <Grid item xs={12} className={classes.spaced}>
            <Typography variant='subheading'>Preview:</Typography>
            <Typography variant='caption' gutterBottom>
              {file.name}
            </Typography>
            <img
              src={`data:${file.type};base64,${base64}`}
              alt={`preview ${file.name}`}
              style={{ width: '40%' }}
            />
          </Grid>
        )}
        <Grid item xs={12} className={classes.spaced}>
          <Button
            color='primary'
            variant='contained'
            disabled={!file}
            onClick={this.moveToStep(+1, () => ({
              crop: defaultCrop(),
              pixelCrop: null,
              cropBase64: null
            }))}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    )
  }

  handleCropUpdate = async (crop, pixelCrop) => {
    const { file } = this.state
    const cropBase64 = await this.extractCropBase64(pixelCrop)
    const { width } = await base64Img.getDimensions({
      type: file.type,
      base64: cropBase64
    })
    if (width < photoWidth) {
      return this.showWidthValidationError()
    }
    const resized = await base64Img.resize({
      type: file.type,
      base64: cropBase64,
      width: photoWidth
    })
    this.setState({
      crop,
      pixelCrop,
      cropBase64: resized
    })
  }

  handleCropImageLoaded = async file => {
    const width = Math.floor(file.width * aspect)
    const height = Math.floor(file.height * aspect)
    const cropBase64 = await this.extractCropBase64({
      x: 0,
      y: 0,
      width,
      height
    })
    const crop = makeAspectCrop(defaultCrop(), file.width / file.height)
    this.setState({ cropBase64, crop })
  }

  renderCropStep () {
    const { classes } = this.props
    const { file, base64, crop, cropBase64 } = this.state
    return (
      <Grid container>
        <Grid
          item
          xs={12}
          className={classes.spaced}
          style={{ textAlign: 'center' }}
        >
          <Typography variant='caption' gutterBottom>
            {file.name}
          </Typography>
          <ReactCrop
            keepSelection
            crop={crop}
            src={`data:${file.type};base64,${base64}`}
            imageStyle={{ width: '100%' }}
            onChange={this.handleCropUpdate}
            onImageLoaded={this.handleCropImageLoaded}
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Button
            color='primary'
            onClick={this.moveToStep(-1, () => ({
              file: null,
              base64: null
            }))}
          >
            Back
          </Button>
          <Button
            color='primary'
            variant='contained'
            disabled={!cropBase64}
            onClick={this.moveToStep(+1)}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    )
  }

  handleImport = async () => {
    this.setState({ saving: true })
    const { uid } = auth().currentUser
    const { showError, showSuccess } = this.props
    const { file, customName, tmpPath, cropBase64 } = this.state
    const path = photoPath(uid, file.name)
    try {
      if (tmpPath) {
        storage()
          .ref(tmpPath)
          .delete()
      }
      await storage()
        .ref(path)
        .putString(cropBase64, 'base64')
      showSuccess('Photo successfully uploaded!')
      const photo = await photosAPI.createPhoto({
        path,
        customName,
        name: file.name,
        type: file.type,
        size: file.size
      })
      setTimeout(
        () =>
          this.setState({
            tab: 'select',
            step: 0,
            ...this.resetImage(),
            face: null,
            detectingFace: false,
            photos: [photo, ...this.state.photos]
          }),
        2000
      )
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  renderDetectFaceStep () {
    const { classes } = this.props
    const { file, detectingFace, face, saving } = this.state
    setImmediate(this.drawPhoto)
    return (
      <Grid container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='subheading'>
            Exactly one face has to be detected in order to import the photo.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.spaced}
          style={{ textAlign: 'center' }}
        >
          <Typography variant='caption' gutterBottom>
            {file.name}
          </Typography>
          <canvas id='face' />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Button
            color='primary'
            onClick={this.moveToStep(-1, () => ({
              crop: defaultCrop(),
              pixelCrop: null,
              cropBase64: null,
              face: null,
              detectingFace: false
            }))}
          >
            Back
          </Button>
          <Button
            disabled={detectingFace || !!face}
            color='primary'
            variant='contained'
            onClick={this.handleDetectFace}
          >
            {detectingFace ? 'Decting...' : 'Detect face'}
          </Button>
          <Button
            disabled={!face || saving}
            color='primary'
            variant='contained'
            onClick={this.handleImport}
            style={{ marginLeft: 5 }}
          >
            {saving ? 'Importing...' : 'Import'}
          </Button>
        </Grid>
      </Grid>
    )
  }

  renderImportTab () {
    const { step, photos } = this.state
    const fns = [
      this.renderSelectStep.bind(this),
      this.renderCropStep.bind(this),
      this.renderDetectFaceStep.bind(this)
    ]
    return (
      <div>
        <Stepper activeStep={step} alternativeLabel>
          {this.steps().map((label, idx) => (
            <Step key={idx} disabled={idx === 0 && !photos.length}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {fns[step]()}
      </div>
    )
  }

  handleClose = () => {
    this.props.onClose()
    this.setState({
      step: 0,
      tab: 'select',
      face: null,
      ...this.resetImage()
    })
  }

  render () {
    const { classes, open } = this.props
    const { loading, tab } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    return (
      <Dialog fullScreen open={open} onClose={this.handleClose}>
        <AppBar style={{ position: 'relative' }} color='primary'>
          <Toolbar>
            <IconButton color='inherit' onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography
              variant='title'
              color='inherit'
              className={classes.flex}
            >
              Gallery
            </Typography>
          </Toolbar>
          <Tabs fullWidth value={['select', 'import'].indexOf(tab)}>
            <Tab
              label='Select'
              onClick={() => this.setState({ tab: 'select' })}
              className={classes.tab}
              icon={<SelectIcon />}
            />
            <Tab
              label='Import'
              onClick={() => this.setState({ tab: 'import' })}
              className={classes.tab}
              icon={<AddIcon />}
            />
          </Tabs>
        </AppBar>
        {tab === 'select' ? this.renderSelectTab() : this.renderImportTab()}
      </Dialog>
    )
  }
}

export default withAll(GaleryDialog, {
  withIntl: true,
  withMsgSnack: true,
  withStyles: true
})
