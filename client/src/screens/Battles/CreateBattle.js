import React, { Component } from 'react'
import { auth, storage } from 'firebase'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import FileInput from 'react-simple-file-input'
import withAll from '../../utils/with'
import photoPath from '../../utils/photoPath'
import VerifyYourEmail from '../../components/VerifyYourEmail'
import * as battlesAPI from '../../api/battles'

const fileInfo = file => ({
  name: file.name,
  type: file.type,
  size: file.size,
  lastModified: file.lastModified
})

const photoResetAttrs = () => ({ file: null, base64: null, loading: null })

const isTypeImage = type => type.substr(0, 6) === 'image/'

const maxPhotoSize = 600 * 1000 // 600kB

class CreateBattle extends Component {
  state = {
    name: '',
    battlesID: [],
    isPro: false,
    photo1: photoResetAttrs(),
    photo2: photoResetAttrs(),
    loading: false,
    saving: null
  }

  checkPhoto (file, num) {
    const { t } = this.props
    const err = (() => {
      if (!file) {
        return t('Photo #{{num}} is required.', { num: num + 1 })
      }
      if (!isTypeImage(file.type)) {
        return t('Photo #{{num}} is not a valid image.', { num: num + 1 })
      }
      if (file.size > maxPhotoSize) {
        return t('Photo #{{num}} size should be <= {{maxSize}}', {
          num: num + 1,
          maxSize: maxPhotoSize
        })
      }
    })()
    if (err) {
      document.querySelectorAll('input[type=file]')[num].focus()
      return err
    }
  }

  handleSave = async () => {
    const user = auth().currentUser
    const { showSuccess, showError } = this.props
    const { name, isPro, photo1, photo2 } = this.state
    const trimName = name.trim()
    const file1 = photo1.file
    const file2 = photo2.file
    if (!trimName.length) {
      document.querySelector('#name').focus()
      return showError('Name is required.')
    }
    const file1Err = this.checkPhoto(file1, 0)
    if (file1Err) {
      return showError(file1Err)
    }
    const file2Err = this.checkPhoto(file2, 1)
    if (file2Err) {
      return showError(file2Err)
    }
    this.setState({ saving: 0 })
    const photo1Path = photoPath(user.uid, file1.name)
    const photo2Path = photoPath(user.uid, file2.name)
    try {
      await storage()
        .ref(photo1Path)
        .putString(photo1.base64, 'base64')
      this.setState({ saving: 33 })
      await storage()
        .ref(photo2Path)
        .putString(photo2.base64, 'base64')
      this.setState({ saving: 66 })
      await battlesAPI.createForCurrentUser({
        name: trimName,
        isPro,
        photo1Path,
        photo2Path,
        file1: fileInfo(file1),
        file2: fileInfo(file2)
      })
      showSuccess('Battle has been created in drafts.')
      setTimeout(() => this.props.history.push('/battles/drafts'), 2000)
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: null })
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
          required
          fullWidth
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

  render () {
    const { t, classes } = this.props
    const { name, isPro } = this.state
    const { saving, loading } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    const { emailVerified } = auth().currentUser
    return (
      <div className={classes.spaced}>
        <Grid container>
          <Grid item xs={12} className={classes.spaced}>
            <TextField
              id='name'
              autoFocus
              fullWidth
              required
              label={t('battles:name')}
              value={name}
              onChange={({ currentTarget }) => {
                const name = currentTarget.value
                if (name.length < 40) {
                  this.setState({ name })
                }
              }}
            />
          </Grid>
          {this.renderPhotoUploader(1)}
          {this.renderPhotoUploader(2)}
          <Grid item xs={12} className={classes.spaced}>
            <Switch
              onChange={({ currentTarget }) =>
                this.setState({ isPro: currentTarget.checked })
              }
              checked={isPro}
            />
            <Typography style={{ display: 'inline' }}>
              Is Profesionnal?
            </Typography>
          </Grid>
          {!emailVerified ? (
            <VerifyYourEmail />
          ) : (
            <Grid item xs={12} className={classes.spaced}>
              {Number.isInteger(saving) ? (
                <LinearProgress
                  color='secondary'
                  variant='determinate'
                  value={saving}
                />
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
          )}
        </Grid>
      </div>
    )
  }
}

export default withAll(CreateBattle, {
  withStyles: true,
  withIntl: true,
  withRouter: true,
  withMsgSnack: true
})
