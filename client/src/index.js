import './utils/initializeFirebase'

import React from 'react'
import { render } from 'react-dom'
import App from './App'
import registerServiceWorker from './utils/registerServiceWorker'

import './utils/initializeI18n'

render(<App />, document.querySelector('#root'))

registerServiceWorker()
