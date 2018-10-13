import 'typeface-roboto'
import './utils/initializeFirebase'

import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Router } from 'react-router-dom'
import { render } from 'react-dom'
import GA from './ga'
import App from './App'
import registerServiceWorker from './utils/registerServiceWorker'

import './utils/initializeI18n'
import './utils/wakeUpAPI'

const history = createHistory()
history.listen((location, action) => {
  if (GA.ga()) {
    GA.set({ page: location.pathname })
    GA.pageview(location.pathname)
  }
})

render(
  <Router history={history}>
    <App />
  </Router>,
  document.querySelector('#root')
)

registerServiceWorker()
