import React, { Component } from 'react'
import { auth, storage } from 'firebase'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import SuccessIcon from '@material-ui/icons/Done'
import ErrorIcon from '@material-ui/icons/ReportProblem'
import FileInput from 'react-simple-file-input'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import withAll from '../../utils/combinedWith'
import * as battlesAPI from '../../api/battles'

const fileInfo = file => ({
  name: file.name,
  type: file.type,
  size: file.size,
  lastModified: file.lastModified
})

const photoResetAttrs = () => ({ file: null, base64: null, loading: null })

const photoPath = (userUID, fileName) =>
  `photos/${userUID}/${btoa(fileName + String(new Date().getTime()))}`

const isTypeImage = type => type.substr(0, 6) === 'image/'

const photoHeight = 120
const photoRatio = 2 / 3

const cropOpts = () => ({
  x: 0,
  y: 0,
  width: 200,
  maxWidth: 200,
  height: Math.floor(200 / photoRatio),
  aspect: photoRatio
})

export default withAll(
  class extends Component {
    state = {
      name: '',
      battlesID: [],
      photo1: photoResetAttrs(),
      crop1: cropOpts(),
      photo2: photoResetAttrs(),
      crop2: cropOpts(),
      msg: null,
      loading: false
    }

    showErr = contents => this.setState({ msg: { type: 'error', contents } })
    showSuccess = contents =>
      this.setState({ msg: { type: 'success', contents } })

    handleSave = async () => {
      const user = auth().currentUser
      const { name, photo1, photo2 } = this.state
      const { crop1, crop2 } = this.state
      const trimName = name.trim()
      const file1 = photo1.file
      const file2 = photo2.file
      if (!trimName.length) {
        return this.showErr('Name is required.')
      }
      if (!file1 || !file2) {
        return this.showErr('Two photos are required.')
      }
      if (!isTypeImage(file1.type) || !isTypeImage(file2.type)) {
        return this.showErr('Invalid image.')
      }
      this.setState({ loading: true })
      const photo1Path = photoPath(user.uid, file1.name)
      const photo2Path = photoPath(user.uid, file2.name)
      try {
        await Promise.all([
          storage().ref(photo1Path).putString(photo1.base64, 'base64').then(),
          storage().ref(photo2Path).putString(photo2.base64, 'base64').then()
        ])
      } catch (err) {
        this.showErr(err.message)
        return this.setState({ loading: false })
      }
      try {
        await battlesAPI.createForCurrentUser(
          {
            name: trimName,
            photo1Path,
            photo2Path,
            file1: fileInfo(file1),
            file2: fileInfo(file2)
          },
          {
            crop1,
            crop2
          }
        )
        this.showSuccess('Battle has been created in drafts.')
      } catch (err) {
        this.showErr(err.message)
      }
      this.setState({ loading: false })
      setTimeout(() => window.location.replace('/battles/drafts'), 1000)
    }

    renderProgressBar = ({ loaded, total }) => {
      const value = loaded === 0 ? 0 : Math.floor(loaded * 100 / total)
      return <LinearProgress variant='determinate' value={value} />
    }

    handlePhotoUploadProgress = num => ({ loaded, total, target }) => {
      const field = `photo${num}`
      if (loaded === total) {
        const base64 = Buffer.from(target.result).toString('base64')
        return this.setState({
          [field]: {
            ...this.state[field],
            loading: null,
            base64
          }
        })
      }
      this.setState({
        [field]: {
          ...this.state[field],
          loading: { loaded, total }
        }
      })
    }

    handlePhotoCrop = cropField => crop =>
      this.setState({ [cropField]: { ...this.state[cropField], ...crop } })

    renderPhotoUploader = num => {
      const { classes } = this.props
      const field = `photo${num}`
      const cropField = `crop${num}`
      const photo = this.state[field]
      const crop = this.state[cropField]
      return (
        <Grid item xs={12} className={classes.spaced}>
          <Typography>Photo {num}</Typography>
          <FileInput
            readAs='buffer'
            onChange={file =>
              this.setState({ [field]: { ...photoResetAttrs(), file } })}
            onProgress={this.handlePhotoUploadProgress(num)}
          />
          <div style={{ marginTop: '5px' }}>
            {photo.loading && this.renderProgressBar(photo.loading)}
            {photo.base64 &&
              <ReactCrop
                crop={crop}
                onImageLoaded={({ width, height }) =>
                  this.setState({
                    [cropField]: makeAspectCrop(
                      this.state[cropField],
                      width / height
                    )
                  })}
                onChange={this.handlePhotoCrop(cropField)}
                style={{ width: '100%', height: photoHeight }}
                src={`data:${photo.file.type};base64,${photo.base64}`}
              />}
          </div>
        </Grid>
      )
    }

    renderMsg = () => {
      const { t } = this.props
      const { msg } = this.state
      if (!msg) {
        return null
      }
      return (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={() => this.setState({ msg: null })}
          ContentProps={{ 'aria-describedby': 'message-id' }}
          message={
            <p id='message-id'>
              {msg.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
              {t(`battles:${msg.contents}`)}
            </p>
          }
        />
      )
    }

    render () {
      const { t, classes } = this.props
      const { name, loading } = this.state
      if (loading) {
        return <LinearProgress color='secondary' />
      }
      return (
        <div className='with-padding'>
          <Typography variant='headline'>
            {t('battles:createBattle')}
          </Typography>
          <Divider />
          {this.renderMsg()}
          <Grid container>
            <Grid item xs={12} className={classes.spaced}>
              <TextField
                label={t('battles:name')}
                value={name}
                onChange={({ target }) => this.setState({ name: target.value })}
              />
            </Grid>
            {this.renderPhotoUploader(1)}
            {this.renderPhotoUploader(2)}
            <Grid item xs={12} className={classes.spaced}>
              <Button
                variant='contained'
                color='primary'
                onClick={this.handleSave}
              >
                {t('save')}
              </Button>
            </Grid>
          </Grid>
        </div>
      )
    }
  }
)
