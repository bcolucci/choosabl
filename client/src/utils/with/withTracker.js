import React, { Component } from 'react'
import ga from 'react-ga'
import { auth } from 'firebase'

const ACTIONS = {
  SIGN_IN_ACTION: 'signIn',
  SIGN_OUT_ACTION: 'signOut',
  CREATE_ACTION: 'create',
  UPDATE_ACTION: 'update',
  DELETE_ACTION: 'delete',
  OPEN_ACTION: 'open'
}

export default (options = {}) => WrappedComponent =>
  class extends Component {
    constructor (props) {
      super(props)
      this.events = Object.values(ACTIONS).reduce(
        (acc, action) => ({ ...acc, [action]: this.pushEvent(action) }),
        {}
      )
    }

    componentDidMount () {
      this.attachAuthListener()
      this.sendCurrentPageView()
    }

    componentWillUnmount () {
      this.removeAuthListener()
    }

    sendCurrentPageView () {
      const page = window.location.pathname
      ga.set({ page, ...options })
      ga.pageview(page)
    }

    attachAuthListener () {
      this.removeAuthListener = auth().onAuthStateChanged(
        user => (this.user = user ? user.uid : null)
      )
    }

    pushEvent = action => (...labels) => {
      if (this.user) {
        labels.push(`user ${this.user}`)
      }
      const path = window.location.pathname
        .split('?')
        .shift()
        .substr(1)
        .replace(/\//g, '_')
      ga.event({
        action,
        label: labels.join(' '),
        category: path || 'app'
      })
    }

    render () {
      return <WrappedComponent {...this.props} events={this.events} />
    }
  }
