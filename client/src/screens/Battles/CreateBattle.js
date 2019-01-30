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

const photoRequiredErr = (t, num) => t('Photo #{{num}} required.', { num })

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

  componentDidMount () {
    window.addEventListener('resize', this._handleScreenResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._handleScreenResize)
  }

  _handleScreenResize = () => this.forceUpdate()

  handleSave = async () => {
    const { t, events, showSuccess, showError } = this.props
    const { name, isPro, photo1, photo2 } = this.state
    const trimName = name.trim()
    if (!trimName.length) {
      document.querySelector('#name').focus()
      return showError(t('battles:Name is required.'))
    }
    if (!photo1) {
      return showError(photoRequiredErr(t, 1))
    }
    if (!photo2) {
      return showError(photoRequiredErr(t, 2))
    }
    if (photo1.id === photo2.id) {
      return showError(t('battles:Please select different photos.'))
    }
    this.setState({ saving: true })
    try {
      const newBattle = await battlesAPI.createForCurrentUser({
        name: trimName,
        photo1: photo1.id,
        photo2: photo2.id,
        isPro
      })
      events.create(newBattle.id)
      showSuccess(t('battles:Battle has been created in drafts.'))
      setTimeout(() => this.props.history.push('/battles/drafts'), 1500)
    } catch (err) {
      showError(err.message)
    }
    this.setState({ saving: false })
  }

  renderPhotoSelector = num => {
    const { t, classes } = this.props
    const { photo1, photo2 } = this.state
    const photo = num === 1 ? photo1 : photo2
    const btnText =
      window.innerWidth <= 600
        ? t('battles:Select')
        : t('battles:Select a photo')
    return (
      <Grid container className={classes.spaced}>
        <Grid item xs={6} sm={4}>
          <Typography>{t('Photo #{{num}}:', { num })}</Typography>
          <img
            alt={`battle choice #${num}`}
            src={
              photo ? `data:${photo.type};base64,${photo.base64}` : '/noimg.png'
            }
            style={{ height: 120 }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sm={2}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Button
            color='primary'
            variant='outlined'
            onClick={() => this.setState({ openedGallery: num })}
          >
            {btnText}
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
          <Grid item xs={12} sm={6} className={classes.spaced}>
            <TextField
              id='name'
              autoFocus
              required
              fullWidth
              label={t('battles:Name')}
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
              {t('battles:Is it for a profesionnal usage?')}
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
                {saving ? t('Saving...') : t('save')}
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
  withMsgSnack: true
})
