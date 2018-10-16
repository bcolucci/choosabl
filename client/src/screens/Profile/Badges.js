import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import withAll from '../../utils/with'
import * as profilesAPI from '../../api/profiles'

class Badges extends Component {
  state = {
    stats: null,
    loading: true
  }

  async componentDidMount () {
    const stats = await profilesAPI.currentProfileStats()
    this.setState({ stats, loading: false })
  }

  render () {
    const { loading, stats } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    return (
      <div>
        <p style={{ color: 'orange', fontWeight: 'bold' }}>TODO CSS</p>
        <pre>{JSON.stringify(stats, null, 2)}</pre>
      </div>
    )
  }
}

export default withAll(Badges, {
  withIntl: true
})
