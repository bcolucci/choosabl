import React from 'react'
import ReactDOM from 'react-dom'
import Play from './Play'
import './utils/initializeFirebase'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Play />, div)
})
