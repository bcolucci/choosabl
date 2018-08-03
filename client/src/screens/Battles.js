import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Badge from '@material-ui/core/Badge'
import VisibilityIcon from '@material-ui/icons/Visibility'
import LinearProgress from '@material-ui/core/LinearProgress'
import DraftIcon from '@material-ui/icons/Drafts'
import AddIcon from '@material-ui/icons/Add'
import ListBattles from './Battles/ListBattles'
import CreateBattle from './Battles/CreateBattle'
import withAll from '../utils/combinedWith'
import * as battlesAPI from '../api/battles'

export default withAll(
  class extends Component {
    state = {
      menu: 0,
      actives: [],
      drafts: [],
      loading: true
    }

    async componentWillMount () {
      const battles = await battlesAPI.getAllForCurrentUser()
      const actives = battles.filter(({ active }) => active)
      const drafts = battles.filter(({ active }) => !active)
      this.setState({ actives, drafts, loading: false })
    }

    render () {
      const { classes } = this.props
      const { menu, loading, actives, drafts } = this.state
      if (loading) {
        return <LinearProgress color='secondary' />
      }
      return (
        <div>
          <AppBar position='static' color='default'>
            <Tabs
              fullWidth
              value={menu}
              onChange={(e, menu) => this.setState({ menu })}
            >
              <Tab
                label='Active'
                className={classes.tab}
                icon={
                  <Badge badgeContent={actives.length} color='secondary'>
                    <VisibilityIcon />{' '}
                  </Badge>
                }
              />
              <Tab
                label='Draft'
                className={classes.tab}
                icon={
                  <Badge badgeContent={drafts.length} color='secondary'>
                    <DraftIcon />
                  </Badge>
                }
              />
              <Tab label='Create' className={classes.tab} icon={<AddIcon />} />
            </Tabs>
          </AppBar>
          <div className='with-padding'>
            {menu === 0 && <ListBattles active battles={actives} />}
            {menu === 1 && <ListBattles active={false} battles={drafts} />}
            {menu === 2 && <CreateBattle />}
          </div>
        </div>
      )
    }
  },
  {
    styles: theme => ({
      tab: {
        paddingTop: '5px'
      }
    })
  }
)
