import React, { Component } from 'react'
import { EventEmitter } from 'events'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import withAll from '../utils/with'
import VerifyYourEmail from '../components/VerifyYourEmail'
import * as battlesAPI from '../api/battles'
import * as votesAPI from '../api/votes'
import * as profilesAPI from '../api/profiles'

const defaultOpacity = 0.9

class Vote extends Component {
  state = {
    battles: [],
    current: null,
    profile: null,
    loading: true,
    height: null,
    photo1Opacity: defaultOpacity,
    photo2Opacity: defaultOpacity
  }

  constructor (props) {
    super(props)
    this.handleScreenResize = this.handleScreenResize.bind(this)
    this.customListener = new EventEmitter()
  }

  async shiftNextBattle () {
    const battles = await battlesAPI.getAvailablesForCurrentUser()
    const [current] = battles
    if (current) {
      const photos = await battlesAPI.downloadPhotos(current)
      Object.assign(current, { photos })
    }
    this.customListener.emit('nextBattleLoaded', { battles, current })
  }

  componentDidMount () {
    this.customListener.on(
      'nextBattleLoaded',
      this._handleNextBattleLoadedLoaded
    )
    window.addEventListener('resize', this.handleScreenResize)
    this.shiftNextBattle()
  }

  _handleNextBattleLoadedLoaded = async ({ battles, current }) => {
    const profile = await profilesAPI.getCurrent()
    this.setState({ profile, battles, current, loading: false })
  }

  componentWillUnmount () {
    this.customListener.removeAllListeners()
    window.removeEventListener('resize', this.handleScreenResize)
  }

  handleScreenResize = () => {
    const screenHeight = window.screen.height
    const header = document.querySelector('header')
    if (!header) {
      return setTimeout(this.handleScreenResize, 100)
    }
    const headerHeight = document.querySelector('header').clientHeight
    const height = Math.floor((screenHeight - headerHeight - 12) / 2)
    this.setState({ height })
  }

  handleOnPhotoOver = num => () =>
    this.setState({
      photo1Opacity: num === 0 ? 1 : defaultOpacity,
      photo2Opacity: num === 1 ? 1 : defaultOpacity
    })

  handleChoosePhoto = (current, num) => async () => {
    this.setState({ loading: true })
    await votesAPI.voteForBattle(current.id, num)
    await this.shiftNextBattle()
    this.setState(({ profile }) => ({
      profile: {
        ...profile,
        votes: profile.votes + 1
      },
      loading: false
    }))
  }

  renderPhoto (num) {
    const { current, height } = this.state
    const { id, type } = current[`photo${num + 1}`]
    return (
      <img
        src={`data:${type};base64,${current.photos[num]}`}
        alt={`${current.name} choice #${num + 1}`}
        style={{
          height,
          opacity: this.state[`photo${num + 1}Opacity`],
          marginTop: num === 0 ? 4 : 0
        }}
        onMouseOver={this.handleOnPhotoOver(num)}
        onClick={id && this.handleChoosePhoto(current, num)}
      />
    )
  }

  render () {
    const { t, user, classes } = this.props
    const { loading, profile, current } = this.state
    if (!user.emailVerified) {
      return <VerifyYourEmail />
    }
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    if (!current) {
      return (
        <Typography variant='subtitle1' className={classes.spaced} gutterBottom>
          {t('vote:No more battle found.')}
        </Typography>
      )
    }
    setImmediate(() => this.state.height === null && this.handleScreenResize())
    return (
      <div style={{ backgroundColor: '#1769aacf', textAlign: 'center' }}>
        {this.renderPhoto(0)}
        {this.renderPhoto(1)}
        <Fab
          color='secondary'
          style={{
            position: 'absolute',
            top: '50%',
            right: 10
          }}
        >
          {profile.votes}
        </Fab>
      </div>
    )
  }
}

export default withAll(Vote, {
  withIntl: true,
  withStyles: true
})
