import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import withAll from '../../utils/with'
import * as profilesAPI from '../../api/profiles'

class Badges extends Component {
  state = {
    profile: null,
    loading: true
  }

  async componentDidMount () {
    const profile = await profilesAPI.getCurrent()
    this.setState({ profile, loading: false })
  }

  render () {
    const { loading, profile } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    return (
      <div>
        BADGES PAGE HERE
        <p>Remaining votes: {profile.votes}</p>
      </div>
    )
  }
}

export default withAll(Badges, {
  withIntl: ['profile']
})
