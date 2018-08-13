import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import withAll from '../utils/with'
import VerifyYourEmail from '../components/VerifyYourEmail'
import * as battlesAPI from '../api/battles'

class Vote extends Component {
  state = {
    battles: [],
    current: null,
    loading: true,
    height: null
  }

  constructor (props) {
    super(props)
    this.handleScreenResize = this.handleScreenResize.bind(this)
  }

  async componentWillMount () {
    const battles = await battlesAPI.getAvailablesForCurrentUser()
    const current = battles[0]
    if (current) {
      const photos = await battlesAPI.downloadPhotos(current)
      Object.assign(current, { photos })
    }
    this.setState({ battles, current, loading: false })
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

  render () {
    const { classes, user } = this.props
    const { loading, current, height } = this.state
    if (!user.emailVerified) {
      return <VerifyYourEmail />
    }
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    if (!current) {
      return <p className={classes.spaced}>No battle found.</p>
    }
    setImmediate(() => {
      if (this.state.height !== null) {
        return
      }
      this.handleScreenResize()
    })
    return (
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#2a398c'
        }}
      >
        <img
          src={`data:${current.file1.type};base64,${current.photos[0]}`}
          alt={`${current.name} choice #1`}
          style={{ height, marginTop: 4 }}
        />
        <img
          src={`data:${current.file2.type};base64,${current.photos[1]}`}
          alt={`${current.name} choice #2`}
          style={{ height }}
        />
      </div>
    )
  }
}

export default withAll(Vote, {
  withStyles: true
})
