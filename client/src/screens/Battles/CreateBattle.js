import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import FileInput from 'react-simple-file-input'
import withAll from '../../utils/combinedWith'

const photoResetAttrs = () => ({ file: null, base64: null, loading: null })

export default withAll(
  class extends Component {
    state = {
      name: '',
      photo1: photoResetAttrs(),
      photo2: photoResetAttrs()
    }

    handleSave = () => {
      window.alert('save')
    }

    renderProgressBar = ({ loaded, total }) => {
      const value = loaded === 0 ? 0 : Math.floor(loaded * 100 / total)
      return <LinearProgress variant='determinate' value={value} />
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
            onProgress={({ loaded, total, target }) => {
              if (loaded === total) {
                const base64 = Buffer.from(target.result).toString('base64')
                this.setState({
                  [field]: {
                    ...this.state[field],
                    base64,
                    loading: null
                  }
                })
                return
              }
              this.setState({
                [field]: {
                  ...this.state[field],
                  loading: { loaded, total }
                }
              })
            }}
          />
          <div style={{ marginTop: '5px' }}>
            {photo.loading && this.renderProgressBar(photo.loading)}
            {photo.base64 && (
              <img
                alt={photo.file.name}
                src={`data:${photo.file.type};base64,${photo.base64}`}
                style={{ width: '45%' }}
              />
            )}
          </div>
        </Grid>
      )
    }

    render () {
      const { t, classes } = this.props
      const { name } = this.state
      return (
        <div className='with-padding'>
          <Typography variant='headline'>
            {t('battles:createBattle')}
          </Typography>
          <Divider />
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
