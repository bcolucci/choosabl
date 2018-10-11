import 'typeface-roboto'
import './utils/initializeFirebase'

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from 'react-dom'
import App from './App'
import registerServiceWorker from './utils/registerServiceWorker'

import './utils/initializeI18n'
import './utils/wakeUpAPI'

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#root')
)

registerServiceWorker()
