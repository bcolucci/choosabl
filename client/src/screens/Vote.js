import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import withAll from '../utils/with'
import VerifyYourEmail from '../components/VerifyYourEmail'
import * as battlesAPI from '../api/battles'
import * as votesAPI from '../api/votes'

const defaultOpacity = 0.9

class Vote extends Component {
  state = {
    battles: [],
    current: null,
    loading: true,
    height: null,
    photo1Opacity: defaultOpacity,
    photo2Opacity: defaultOpacity
  }

  constructor (props) {
    super(props)
    this.handleScreenResize = this.handleScreenResize.bind(this)
  }

  async componentWillMount () {
    this.setState({ loading: true })
    await this.shiftNextBattle()
    this.setState({ loading: false })
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

  componentDidMount () {
    window.addEventListener('resize', this.handleScreenResize, false)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleScreenResize)
  }

  handleScreenResize () {
    const screenHeight = window.screen.height
    const headerHeight = window.document.querySelector('header').clientHeight
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
    this.setState({ loading: false })
  }

  renderPhoto (num) {
    const { current, height } = this.state
    return (
      <img
        src={`data:${current[`file${num + 1}`].type};base64,${
          current.photos[num]
        }`}
        alt={`${current.name} choice #${num + 1}`}
        style={{
          height,
          opacity: this.state[`photo${num + 1}Opacity`],
          marginTop: num === 0 ? 4 : 0
        }}
        onMouseOver={this.handleOnPhotoOver(num)}
        onClick={this.handleChoosePhoto(current, num)}
      />
    )
  }

  render () {
    const { classes, user } = this.props
    const { loading, current } = this.state
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
      </div>
    )
  }
}

export default withAll(Vote, {
  withStyles: true
})
