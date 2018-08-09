import React, { Component } from 'react'
import { auth, storage } from 'firebase'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import SuccessIcon from '@material-ui/icons/Done'
import ErrorIcon from '@material-ui/icons/ReportProblem'
import FileInput from 'react-simple-file-input'
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

export default withAll(
  class extends Component {
    state = {
      name: '',
      battlesID: [],
      photo1: photoResetAttrs(),
      photo2: photoResetAttrs(),
      msg: null,
      loading: false,
      saving: false
    }

    showErr = contents => this.setState({ msg: { type: 'error', contents } })

    showSuccess = contents =>
      this.setState({ msg: { type: 'success', contents } })

    handleSave = async () => {
      const user = auth().currentUser
      const { name, photo1, photo2 } = this.state
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
      this.setState({ saving: true })
      const photo1Path = photoPath(user.uid, file1.name)
      const photo2Path = photoPath(user.uid, file2.name)
      try {
        await Promise.all([
          storage()
            .ref(photo1Path)
            .putString(photo1.base64, 'base64')
            .then(),
          storage()
            .ref(photo2Path)
            .putString(photo2.base64, 'base64')
            .then()
        ])
      } catch (err) {
        this.showErr(err.message)
        return this.setState({ saving: false })
      }
      try {
        await battlesAPI.createForCurrentUser({
          name: trimName,
          photo1Path,
          photo2Path,
          file1: fileInfo(file1),
          file2: fileInfo(file2)
        })
        this.showSuccess('Battle has been created in drafts.')
      } catch (err) {
        this.showErr(err.message)
      }
      this.setState({ saving: false })
      setTimeout(() => window.location.replace('/battles/drafts'), 1500)
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

    renderPhotoUploader = num => {
      const { classes } = this.props
      const field = `photo${num}`
      const photo = this.state[field]
      return (
        <Grid item xs={12} className={classes.spaced}>
          <Typography>Photo {num}</Typography>
          <FileInput
            readAs='buffer'
            onChange={file =>
              this.setState({ [field]: { ...photoResetAttrs(), file } })
            }
            onProgress={this.handlePhotoUploadProgress(num)}
          />
          <div style={{ marginTop: '0.5em' }}>
            {photo.loading && this.renderProgressBar(photo.loading)}
            {photo.base64 &&
              isTypeImage(photo.file.type) && (
                <img
                  alt='first choice'
                  src={`data:${photo.file.type};base64,${photo.base64}`}
                  style={{ height: 120 }}
                />
              )}
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
      const { name, saving, loading } = this.state
      if (loading) {
        return <LinearProgress color='secondary' />
      }
      return (
        <div className='with-padding'>
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
              {saving ? (
                <CircularProgress />
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleSave}
                >
                  {t('save')}
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      )
    }
  }
)
