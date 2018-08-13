import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Badge from '@material-ui/core/Badge'
import VisibilityIcon from '@material-ui/icons/Visibility'
import LinearProgress from '@material-ui/core/LinearProgress'
import DraftIcon from '@material-ui/icons/Drafts'
import AddIcon from '@material-ui/icons/AddCircle'
import ListBattles from './Battles/ListBattles'
import CreateBattle from './Battles/CreateBattle'
import withAll from '../utils/with'
import * as battlesAPI from '../api/battles'

class Battles extends Component {
  static propTypes = {
    menu: PropTypes.number
  }

  static defaultProps = {
    menu: 0
  }

  state = {
    menu: 0,
    actives: [],
    drafts: [],
    loading: true
  }

  constructor (props) {
    super(props)
    this.state.menu = props.menu
  }

  async componentWillMount () {
    const battles = await battlesAPI.getAllForCurrentUser()
    const actives = battles.filter(({ active }) => active)
    const drafts = battles.filter(({ active }) => !active)
    this.setState({ actives, drafts, loading: false })
  }

  moveBattle = dest => (battle, remove = false) => {
    const from = dest === 'actives' ? 'drafts' : 'actives'
    this.setState({
      [from]: this.state[from].filter(b => b.id !== battle.id)
    })
    if (!remove) {
      this.setState({ [dest]: [battle, ...this.state[dest]] })
    }
  }

  render () {
    const { t, classes } = this.props
    const { menu, loading, actives, drafts } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    const moveBattle = this.moveBattle.bind(this)
    return (
      <div>
        <AppBar position='static' color='default'>
          <Tabs fullWidth value={menu}>
            <Tab
              label={t('battles:Actives')}
              href='/battles/actives'
              className={classes.tab}
              icon={
                <Badge badgeContent={actives.length} color='default'>
                  <VisibilityIcon />
                </Badge>
              }
            />
            <Tab
              label={t('battles:Drafts')}
              href='/battles/drafts'
              className={classes.tab}
              icon={
                <Badge badgeContent={drafts.length} color='default'>
                  <DraftIcon />
                </Badge>
              }
            />
            <Tab
              label={t('Create')}
              href='/battles/create'
              className={classes.tab}
              icon={<AddIcon />}
            />
          </Tabs>
        </AppBar>
        <div className={classes.spaced}>
          {menu === 0 && (
            <ListBattles
              active
              battles={actives}
              moveBattle={moveBattle('drafts')}
            />
          )}
          {menu === 1 && (
            <ListBattles
              active={false}
              battles={drafts}
              moveBattle={moveBattle('actives')}
            />
          )}
          {menu === 2 && <CreateBattle />}
        </div>
      </div>
    )
  }
}

export default withAll(Battles, {
  withIntl: true,
  withStyles: {
    styles: theme => ({
      tab: {
        paddingTop: '5px'
      }
    })
  }
})
