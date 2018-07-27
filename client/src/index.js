import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './utils/registerServiceWorker'
import './utils/initializeFirebase'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
