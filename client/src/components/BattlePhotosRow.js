import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import withAll from '../utils/with'
import * as battlesAPI from '../api/battles'

class BattlePhotosRow extends Component {
  static propTypes = {
    battle: PropTypes.object.isRequired,
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  state = {
    photos: [],
    loading: true
  }

  async componentDidMount () {
    const { battle } = this.props
    const photos = await battlesAPI.downloadPhotos(battle)
    this.setState({ photos, loading: false })
  }

  renderPhoto = num => {
    const { battle, onClick } = this.props
    const { photos } = this.state
    const file = battle[`photo${num + 1}`]
    const base64 = photos[num]
    return (
      <Grid item xs={6} style={{ textAlign: 'center' }}>
        <img
          src={
            base64
              ? `data:${file.type};base64,${base64}`
              : '/image-not-found.gif'
          }
          style={{ height: 120, maxWidth: 140 }}
          onClick={() => onClick({ battle, file, base64 })}
          alt={file.name}
        />
      </Grid>
    )
  }

  render () {
    return (
      <Grid container>
        {this.renderPhoto(0)}
        {this.renderPhoto(1)}
      </Grid>
    )
  }
}

export default withAll(BattlePhotosRow)
