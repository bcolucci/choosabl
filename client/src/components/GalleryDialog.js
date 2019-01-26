import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { auth, storage } from 'firebase'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import FileInput from 'react-simple-file-input'
// import imagetracer from 'imagetracerjs'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
// import PreviewIcon from '@material-ui/icons/Visibility'
import AddIcon from '@material-ui/icons/AddCircle'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import SelectIcon from '@material-ui/icons/RecentActors'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import withAll from '../utils/with'
import photoPath from '../utils/photoPath'
import prettyBytes from '../utils/prettyBytes'
import * as base64Img from '../utils/base64Img'
import * as photosAPI from '../api/photos'

import 'react-image-crop/dist/ReactCrop.css'
import { EventEmitter } from 'events'

const aspect = 3.7 / 4
const photoWidth = 250
const maxPhotoSize = 6 * 1000 * 1000 // 6mB

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
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    tab: 'select',
    step: 0,
    photos: [],
    loading: true,
    selected: null,
    selectionEl: null,
    // ---
    file: null,
    customName: '',
    base64: null,
    tmpPath: null,
    // ---
    crop: defaultCrop(),
    pixelCrop: null,
    cropBase64: null,
    isValidCrop: false,
    // ---
    face: null,
    detectingFace: false,
    // ---
    saving: false
  }

  constructor (props) {
    super(props)
    this.photosListener = new EventEmitter()
  }

  componentDidMount () {
    this.photosListener.on('rawLoaded', this._handleRawPhotosLoaded)
    this.photosListener.on('base64Loaded', this._handlePhotosBase64Loaded)
    window.addEventListener('resize', this.handleScreenResize)
    this.loadPhotos()
  }

  componentWillUnmount () {
    this.photosListener.removeAllListeners()
    window.removeEventListener('resize', this.handleScreenResize)
  }

  handleScreenResize = () => this.forceUpdate()

  _handleRawPhotosLoaded = async photos => {
    this.setState({ photos, loading: false })
    const base64 = await Promise.all(
      photos.map(({ path }) =>
        storage()
          .ref(path)
          .getDownloadURL()
          .then(url => base64Img.download(url))
      )
    )
    this.photosListener.emit('base64Loaded', { photos, base64 })
  }

  _handlePhotosBase64Loaded = ({ photos, base64 }) =>
    this.setState({
      photos: photos.map((photo, idx) => ({
        ...photo,
        base64: base64[idx]
      }))
    })

  async loadPhotos () {
    this.setState({ loading: true })
    const photos = await photosAPI.getForCurrentUser()
    this.photosListener.emit('rawLoaded', photos)
  }

  moveToStep = (inc, updateAttrs = () => ({})) => () =>
    this.setState(prev => ({
      step: prev.step + inc,
      ...updateAttrs()
    }))

  handleCloseSelectionMenu = () =>
    this.setState({ selectionEl: null, selected: null })

  handleDeletePhoto = e => {
    e.preventDefault()
    const { selected } = this.state
    const photo = this.state.photos[selected]
    photosAPI.deleteOne(photo)
    this.handleCloseSelectionMenu()
    const photos = this.state.photos.filter(({ id }) => id !== photo.id)
    this.setState({ photos })
  }

  handlePreviewPhoto = e => {
    e.preventDefault()
    const { selected } = this.state
    const photo = this.state.photos[selected]
    // TODO
    console.log('preview', photo)
    this.handleCloseSelectionMenu()
  }

  handleSelectPhoto = idx => e => {
    e.preventDefault()
    const { onSelect, onClose } = this.props
    const photo = this.state.photos[idx]
    onSelect(photo)
    onClose()
  }

  renderSelectTab () {
    const { t, classes } = this.props
    const { photos, selected, selectionEl } = this.state
    if (!photos.length) {
      return (
        <Typography variant='subtitle1' className={classes.spaced} gutterBottom>
          {t('gallery:No photo imported yet.')}
        </Typography>
      )
    }
    const used = selected !== null && this.state.photos[selected].used
    return (
      <div>
        <GridList
          id='gallery-grid'
          cellHeight={180}
          style={{
            marginTop: 3,
            width: window.screen.width
          }}
        >
          {photos.map((photo, idx) => (
            <GridListTile key={idx}>
              <img
                onClick={this.handleSelectPhoto(idx)}
                src={
                  photo.base64
                    ? `data:${photo.type};base64,${photo.base64}`
                    : '/noimg.png'
                }
                alt={`${photo.customName} (${photo.name}) preview`}
              />
              <GridListTileBar
                title={photo.customName}
                subtitle={<span>{photo.name}</span>}
                actionIcon={
                  <IconButton
                    style={{ color: '#fff' }}
                    onClick={({ currentTarget }) => {
                      this.setState({
                        selected: idx,
                        selectionEl: currentTarget
                      })
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
        <Menu
          anchorEl={selectionEl}
          open={!!selectionEl}
          onClose={this.handleCloseSelectionMenu}
        >
          {/* <MenuItem disabled onClick={this.handleSelectPhoto}>
            <PreviewIcon className='menu-icon' />
            Preview
          </MenuItem> */}
          <MenuItem disabled={used} onClick={this.handleDeletePhoto}>
            <DeleteIcon className='menu-icon' />
            {t('Delete')}
            {used && ` (${t('used')})`}
          </MenuItem>
        </Menu>
      </div>
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
    const { t, showError } = this.props
    const { uid } = auth().currentUser
    const path = photoPath(uid, file.name)
    const rawBase64 = cropBase64.split('base64,').pop()
    if (tmpPath) {
      try {
        storage()
          .ref(tmpPath)
          .delete()
      } catch (err) {}
    }
    try {
      await storage()
        .ref(path)
        .putString(rawBase64, 'base64')
      const face = await photosAPI.detectingFace(path)
      if (!Object.keys(face).length) {
        throw new Error(t('gallery:No face detected.'))
      }
      // imagetracer.imageToSVG(
      //   `data:${file.type};base64,${rawBase64}`,
      //   svg => storage().ref(`${path}.svg`).putString(svg),
      //   'artistic4'
      // )
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
    const { t, showError } = this.props
    this.widthErrOpened = true
    showError(
      t('gallery:Photo is too small. Must be >= {{width}}px.', {
        width: photoWidth
      }),
      () => (this.widthErrOpened = false)
    )
  }

  isValideImage ({ type, size }) {
    const { t, showError } = this.props
    if (!isTypeImage(type)) {
      showError(t('Invalid image.'))
      return false
    }
    if (size > maxPhotoSize) {
      showError(
        t('gallery:Image size should be <= {{size}}', {
          size: prettyBytes(maxPhotoSize)
        })
      )
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

  drawPhoto = async () => {
    const canvas = window.document.querySelector('canvas#face')
    if (!canvas) {
      return setTimeout(this.drawPhoto, 100)
    }
    const { file, cropBase64, face } = this.state
    const src = `data:${file.type};base64,${cropBase64}`
    const { width, height } = await base64Img.getDimensions({
      type: file.type,
      base64: cropBase64
    })
    let resizedWidth = width
    if (height > 200) {
      resizedWidth = Math.floor(width * 200 / height)
    }
    const img = new Image()
    img.src = src
    img.height = 200
    img.width = resizedWidth
    img.onload = () => {
      canvas.height = 200
      canvas.width = resizedWidth
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

  renderSelectStep = () => {
    const { t, classes } = this.props
    const { customName, file, base64 } = this.state
    return (
      <Grid container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography>{t('gallery:Give it a name:')}</Typography>
          <TextField
            autoFocus
            required
            fullWidth
            value={customName}
            onChange={({ currentTarget }) =>
              this.setState({ customName: currentTarget.value.substr(0, 50) })
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.spaced}>
          <Typography>
            {t('gallery:Select a photo:')}
            <span className='file-size-caption' style={{ marginLeft: 5 }}>
              ({'<='} {prettyBytes(maxPhotoSize)})
            </span>
          </Typography>
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
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='subtitle1'>{t('gallery:Preview:')}</Typography>
          {base64 ? (
            <div>
              <Typography variant='caption' gutterBottom>
                {file.name}
              </Typography>
              <img
                src={`data:${file.type};base64,${base64}`}
                alt={`preview ${file.name}`}
                style={{ height: '120px' }}
              />
            </div>
          ) : (
            <img
              src='/noimg.png'
              alt='preview - please select a file'
              style={{ height: '120px' }}
            />
          )}
        </Grid>
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
      this.setState({ isValidCrop: false })
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
      isValidCrop: true,
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

  renderCropStep = () => {
    const { t, classes } = this.props
    const { file, base64, crop, cropBase64, isValidCrop } = this.state
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
            style={{ height: '200px' }}
            imageStyle={{ height: '100%' }}
            onChange={crop => this.setState({ crop })}
            onComplete={this.handleCropUpdate}
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
            {t('Back')}
          </Button>
          <Button
            color='primary'
            variant='contained'
            disabled={!cropBase64 || !isValidCrop}
            onClick={this.moveToStep(+1)}
          >
            {t('Next')}
          </Button>
        </Grid>
      </Grid>
    )
  }

  handleImport = async () => {
    this.setState({ saving: true })
    const { uid } = auth().currentUser
    const { t, showError, showSuccess } = this.props
    const { file, customName, cropBase64 } = this.state
    const path = photoPath(uid, file.name)
    try {
      await storage()
        .ref(path)
        .putString(cropBase64, 'base64')
      showSuccess(t('gallery:Photo successfully uploaded!'))
      const photo = await photosAPI.createPhoto({
        path,
        customName,
        name: file.name,
        type: file.type,
        size: file.size
      })
      const photos = [{ ...photo, base64: cropBase64 }, ...this.state.photos]
      setTimeout(
        () =>
          this.setState({
            tab: 'select',
            step: 0,
            face: null,
            detectingFace: false,
            ...this.resetImage(),
            photos
          }),
        2000
      )
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  renderDetectFaceStep = () => {
    const { t, classes } = this.props
    const { file, detectingFace, face, saving } = this.state
    setImmediate(this.drawPhoto)
    return (
      <Grid container>
        <Grid item xs={12} className={classes.spaced}>
          <Typography variant='subtitle1'>
            {t(
              `gallery:Exactly one face has to be detected in order to import the photo.`
            )}
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
            {t('Back')}
          </Button>
          <Button
            disabled={detectingFace || !!face}
            color='primary'
            variant='contained'
            onClick={this.handleDetectFace}
          >
            {detectingFace
              ? t('gallery:Detecting...')
              : t('gallery:Detect face')}
          </Button>
          <Button
            disabled={!face || saving}
            color='primary'
            variant='contained'
            onClick={this.handleImport}
            style={{ marginLeft: 5 }}
          >
            {saving ? t('gallery:Importing...') : t('gallery:Import')}
          </Button>
        </Grid>
      </Grid>
    )
  }

  renderImportTab () {
    const { t } = this.props
    const { step, photos } = this.state
    const fns = [
      this.renderSelectStep,
      this.renderCropStep,
      this.renderDetectFaceStep
    ]
    return (
      <div>
        <Stepper activeStep={step} alternativeLabel>
          {[
            t('gallery:Select a photo'),
            t('gallery:Crop it!'),
            t('gallery:Face detection')
          ].map((label, idx) => (
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
    const { t, classes, open } = this.props
    const { loading, tab } = this.state
    return (
      <Dialog fullScreen open={open} onClose={this.handleClose}>
        <AppBar style={{ position: 'relative' }} color='primary'>
          <Toolbar>
            <IconButton color='inherit' onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' color='inherit' className={classes.flex}>
              {t('gallery:Gallery')}
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
        {loading ? (
          <LinearProgress color='secondary' />
        ) : tab === 'select' ? (
          this.renderSelectTab()
        ) : (
          this.renderImportTab()
        )}
      </Dialog>
    )
  }
}

export default withAll(GaleryDialog, {
  withIntl: true,
  withMsgSnack: true,
  withStyles: true
})
