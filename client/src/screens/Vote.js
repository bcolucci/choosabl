import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
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
  }

  async shiftNextBattle () {
    const battles = await battlesAPI.getAvailablesForCurrentUser()
    const [current] = battles
    if (current) {
      const photos = await battlesAPI.downloadPhotos(current)
      Object.assign(current, { photos })
    }
    this.setState({ battles, current })
  }

  async componentDidMount () {
    window.addEventListener('resize', this.handleScreenResize, false)
    this.setState({ loading: true })
    const profile = await profilesAPI.getCurrent()
    await this.shiftNextBattle()
    this.setState({ profile, loading: false })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleScreenResize)
  }

  handleScreenResize () {
    const screenHeight = window.screen.height
    const header = document.querySelector('header')
    if (!header) {
      return setTimeout(this.handleScreenResize.bind(this), 100)
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
    const { classes, user } = this.props
    const { loading, profile, current } = this.state
    if (!user.emailVerified) {
      return <VerifyYourEmail />
    }
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    if (!current) {
      return <p className={classes.spaced}>No battle found.</p>
    }
    setImmediate(() => this.state.height === null && this.handleScreenResize())
    return (
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#2a398c'
        }}
      >
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
  withStyles: true
})
