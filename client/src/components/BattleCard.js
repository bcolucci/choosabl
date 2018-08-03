import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import withAll from '../utils/combinedWith'

export default withAll(
  class extends Component {
    static propTypes = {
      battle: PropTypes.object.isRequired
    }

    render () {
      const { classes, battle } = this.props
      return (
        <div className={classes.root + ' with-padding'}>
          <Card>
            <CardContent>
              <Typography color='textSecondary'>
                {battle.name}
              </Typography>
              <Grid container style={{ marginTop: '0.5em' }}>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <img
                    src='#'
                    style={{
                      width: '98%',
                      height: '100px',
                      border: '1px solid #666'
                    }}
                  />
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                  <img
                    src='#'
                    style={{
                      width: '98%',
                      height: '100px',
                      border: '1px solid #666'
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      )
    }
  }
)
