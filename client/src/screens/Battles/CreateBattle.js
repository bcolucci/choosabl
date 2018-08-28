import React, { Component } from 'react'
import { auth } from 'firebase'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import withAll from '../../utils/with'
import VerifyYourEmail from '../../components/VerifyYourEmail'
import GalleryDialog from '../../components/GalleryDialog'
import * as battlesAPI from '../../api/battles'

const photoRequiredErr = num => `Photo #${num} required.`

class CreateBattle extends Component {
  state = {
    name: '',
    battlesID: [],
    isPro: false,
    photo1: null,
    photo2: null,
    openedGallery: null,
    loading: false,
    saving: false
  }

  handleSave = async () => {
    const { showSuccess, showError } = this.props
    const { name, isPro, photo1, photo2 } = this.state
    const trimName = name.trim()
    if (!trimName.length) {
      document.querySelector('#name').focus()
      return showError('Name is required.')
    }
    if (!photo1) {
      return showError(photoRequiredErr(1))
    }
    if (!photo2) {
      return showError(photoRequiredErr(2))
    }
    this.setState({ saving: true })
    try {
      await battlesAPI.createForCurrentUser({
        name: trimName,
        photo1: photo1.id,
        photo2: photo2.id,
        isPro
      })
      showSuccess('Battle has been created in drafts.')
      setTimeout(() => this.props.history.push('/battles/drafts'), 1500)
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  renderPhotoSelector = num => {
    const { classes } = this.props
    const { photo1, photo2 } = this.state
    const photo = num === 1 ? photo1 : photo2
    return (
      <Grid container className={classes.spaced}>
        <Grid item xs={6}>
          <Typography>Photo #{num}:</Typography>
          <img
            alt={`battle choice #${num}`}
            src={
              photo ? `data:${photo.type};base64,${photo.base64}` : '/noimg.png'
            }
            style={{ height: 120 }}
          />
        </Grid>
        <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color='primary'
            variant='outlined'
            onClick={() => this.setState({ openedGallery: num })}
          >
            Select a photo
          </Button>
        </Grid>
      </Grid>
    )
  }

  render () {
    const { t, classes } = this.props
    const { name, isPro } = this.state
    const { saving, loading, openedGallery } = this.state
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
        </Grid>
        {this.renderPhotoSelector(1)}
        {this.renderPhotoSelector(2)}
        <Grid container>
          <Grid item xs={12} className={classes.spaced}>
            <Switch
              onChange={({ currentTarget }) =>
                this.setState({ isPro: currentTarget.checked })
              }
              checked={isPro}
            />
            <Typography style={{ display: 'inline' }}>
              Is it for a profesionnal usage?
            </Typography>
          </Grid>
          {!emailVerified ? (
            <VerifyYourEmail />
          ) : (
            <Grid item xs={12} className={classes.spaced}>
              <Button
                variant='contained'
                color='primary'
                disabled={saving}
                onClick={this.handleSave}
              >
                {saving ? 'Saving...' : t('save')}
              </Button>
            </Grid>
          )}
        </Grid>
        <GalleryDialog
          open={openedGallery !== null}
          onClose={() => this.setState({ openedGallery: null })}
          onSelect={photo =>
            this.setState(prev => ({ [`photo${prev.openedGallery}`]: photo }))
          }
        />
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
