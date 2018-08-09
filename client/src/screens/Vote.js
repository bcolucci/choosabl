import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import withAll from '../utils/combinedWith'
import * as battlesAPI from '../api/battles'

export default withAll(
  class extends Component {
    state = {
      battles: [],
      current: null,
      loading: true
    }

    async componentWillMount () {
      const battles = await battlesAPI.getAvailablesForCurrentUser()
      const current = battles[0]
      if (current) {
        const [photo1, photo2] = await battlesAPI.downloadPhotos(current)
        Object.assign(current, { photo1, photo2 })
      }
      this.setState({ battles, current, loading: false })
    }

    render () {
      const { classes } = this.props
      const { loading, current } = this.state
      if (loading) {
        return <LinearProgress color='secondary' />
      }
      if (!current) {
        return <p className={classes.spaced}>No battle found.</p>
      }
      console.log(current)
      return (
        <Grid container className={classes.spaced}>
          <Grid item xs={6}>
            <img
              src={`data:${current.file1.type};base64,${current.photo1}`}
              alt={`${current.name} first choice`}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <img
              src={`data:${current.file2.type};base64,${current.photo2}`}
              alt={`${current.name} second choice`}
              style={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      )
    }
  }
)
