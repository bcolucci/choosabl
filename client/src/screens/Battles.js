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
    tab: PropTypes.string
  }

  static defaultProps = {
    tab: 'actives'
  }

  state = {
    menu: null,
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

  moveBattle = dest => (battle, remove = false) => {
    const from = dest === 'actives' ? 'drafts' : 'actives'
    this.setState(prev => ({
      [from]: prev[from].filter(b => b.id !== battle.id)
    }))
    if (!remove) {
      this.setState(prev => ({ [dest]: [battle, ...prev[dest]] }))
    }
  }

  render () {
    const { t, classes } = this.props
    const { loading, actives, drafts } = this.state
    if (loading) {
      return <LinearProgress color='secondary' />
    }
    const { tab, history } = this.props
    const moveBattle = this.moveBattle.bind(this)
    const goto = href => e => {
      e.preventDefault()
      history.push(href)
    }
    return (
      <div>
        <AppBar position='static' color='default'>
          <Tabs fullWidth value={['actives', 'drafts', 'create'].indexOf(tab)}>
            <Tab
              label={t('battles:Actives')}
              onClick={goto('/battles/actives')}
              className={classes.tab}
              icon={
                <Badge badgeContent={actives.length} color='default'>
                  <VisibilityIcon />
                </Badge>
              }
            />
            <Tab
              label={t('battles:Drafts')}
              onClick={goto('/battles/drafts')}
              className={classes.tab}
              icon={
                <Badge badgeContent={drafts.length} color='default'>
                  <DraftIcon />
                </Badge>
              }
            />
            <Tab
              label={t('create')}
              onClick={goto('/battles/create')}
              className={classes.tab}
              icon={<AddIcon />}
            />
          </Tabs>
        </AppBar>
        <div className={classes.spaced}>
          {tab === 'actives' && (
            <ListBattles
              active
              battles={actives}
              moveBattle={moveBattle('drafts')}
            />
          )}
          {tab === 'drafts' && (
            <ListBattles
              active={false}
              battles={drafts}
              moveBattle={moveBattle('actives')}
            />
          )}
          {tab === 'create' && <CreateBattle />}
        </div>
      </div>
    )
  }
}

export default withAll(Battles, {
  withIntl: true,
  withRouter: true,
  withStyles: true
})
