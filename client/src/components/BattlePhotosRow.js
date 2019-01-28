import React, { Component } from 'react'
import { EventEmitter } from 'events'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import withAll from '../utils/with'
import * as battlesAPI from '../api/battles'

class BattlePhotosRow extends Component {
  static propTypes = {
    battle: PropTypes.object.isRequired,
    photo1Classname: PropTypes.string,
    photo2Classname: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    photo1Classname: 'battle-result',
    photo2Classname: 'battle-result',
    onClick: () => {}
  }

  state = {
    photos: [],
    loading: true
  }

  constructor (props) {
    super(props)
    this.customListener = new EventEmitter()
  }

  componentDidMount () {
    this.customListener.on('photosLoaded', this._handlePhotosLoaded)
    this.loadPhotos()
  }

  _handlePhotosLoaded = photos => this.setState({ photos, loading: false })

  async loadPhotos () {
    const { battle } = this.props
    const photos = await battlesAPI.downloadPhotos(battle)
    this.customListener.emit('photosLoaded', photos)
  }

  componentWillUnmount () {
    this.customListener.removeAllListeners()
  }

  renderPhoto = num => {
    const { battle, onClick } = this.props
    const { photos } = this.state
    const file = battle[`photo${num + 1}`]
    const base64 = photos[num]
    return (
      <Grid
        item
        xs={6}
        style={{ textAlign: 'center' }}
        className={this.props[`photo${num + 1}Classname`]}
      >
        <div className='overlay'>
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
        </div>
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
