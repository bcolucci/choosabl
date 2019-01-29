import React, { Component, Fragment } from 'react'
import { EventEmitter } from 'events'
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
import goto from '../utils/goto'
import * as battlesAPI from '../api/battles'

class Battles extends Component {
  static propTypes = {
    tab: PropTypes.string
  }

  static defaultProps = {
    tab: 'actives'
  }

  state = {
    actives: [],
    drafts: [],
    loading: true
  }

  constructor (props) {
    super(props)
    this.customListener = new EventEmitter()
  }

  componentDidMount () {
    this.customListener.on('battlesLoaded', this._handleBattlesLoaded)
    this.loadBattles()
  }

  async loadBattles () {
    const battles = await battlesAPI.getAllForCurrentUser()
    this.customListener.emit('battlesLoaded', battles)
  }

  _handleBattlesLoaded = battles => {
    const actives = battles.filter(({ active }) => active)
    const drafts = battles.filter(({ active }) => !active)
    this.setState({ actives, drafts, loading: false })
  }

  componentWillUnmount () {
    this.customListener.removeAllListeners()
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
    const { tab } = this.props
    const moveBattle = this.moveBattle.bind(this)
    const go = goto(this.props)
    return (
      <Fragment>
        <AppBar position='static' color='default'>
          <Tabs
            variant='fullWidth'
            value={Math.max(0, ['actives', 'drafts', 'create'].indexOf(tab))}
          >
            <Tab
              label={t('battles:Actives')}
              onClick={go('/battles/actives')}
              className={classes.tab}
              icon={
                <Badge badgeContent={actives.length} color='default'>
                  <VisibilityIcon />
                </Badge>
              }
            />
            <Tab
              label={t('battles:Drafts')}
              onClick={go('/battles/drafts')}
              className={classes.tab}
              icon={
                <Badge badgeContent={drafts.length} color='default'>
                  <DraftIcon />
                </Badge>
              }
            />
            <Tab
              label={t('create')}
              onClick={go('/battles/create')}
              className={classes.tab}
              icon={<AddIcon />}
            />
          </Tabs>
        </AppBar>
        <div className={classes.spaced}>
          {['', 'actives'].includes(tab) && (
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
      </Fragment>
    )
  }
}

export default withAll(Battles, {
  withIntl: true,
  withRouter: true,
  withStyles: true
})
