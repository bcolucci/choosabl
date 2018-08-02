import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Badge from '@material-ui/core/Badge'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DraftIcon from '@material-ui/icons/Drafts'
import AddIcon from '@material-ui/icons/Add'
import ListBattles from './Battles/ListBattles'
import CreateBattle from './Battles/CreateBattle'
import withAll from '../utils/combinedWith'

export default withAll(
  class extends Component {
    state = {
      menu: 0
    }

    render () {
      const { classes } = this.props
      const { menu } = this.state
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
                  <Badge badgeContent={2} color='secondary'>
                    <VisibilityIcon />{' '}
                  </Badge>
                }
              />
              <Tab
                label='Draft'
                className={classes.tab}
                icon={
                  <Badge badgeContent={2} color='secondary'>
                    <DraftIcon />
                  </Badge>
                }
              />
              <Tab label='Create' className={classes.tab} icon={<AddIcon />} />
            </Tabs>
          </AppBar>
          <div className='with-padding'>
            {menu === 0 && <ListBattles active />}
            {menu === 1 && <ListBattles />}
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
