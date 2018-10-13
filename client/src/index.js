import 'typeface-roboto'
import './utils/initializeFirebase'

import React from 'react'
import { Router } from 'react-router-dom'
import { render } from 'react-dom'
import App from './App'
import registerServiceWorker from './utils/registerServiceWorker'
import createHistory from './utils/createHistory'

import './utils/initializeI18n'
import './utils/wakeUpAPI'

render(
  <Router history={createHistory()}>
    <App />
  </Router>,
  document.getElementById('root')
)

registerServiceWorker()
