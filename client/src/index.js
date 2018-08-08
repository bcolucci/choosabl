import './utils/initializeFirebase'

import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { wakeUpAllAPI } from './api'
import registerServiceWorker from './utils/registerServiceWorker'

import './utils/initializeI18n'

if (!localStorage.getItem('wakeUp')) {
  wakeUpAllAPI()
  localStorage.setItem('wakeUp', '1')
}

render(<App />, document.querySelector('#root'))

registerServiceWorker()
