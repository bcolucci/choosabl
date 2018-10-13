import ReactGA from 'react-ga'

const { host } = window.location

const code = (() => {
  if (host === 'choosabl.com') {
    return 'UA-127456637-1'
  }
  if (host === 'choosabl-test.firebaseapp.com') {
    return 'UA-127382235-1'
  }
  return 'UA-XXXXXXXXX-Y'
})()

ReactGA.initialize(code, {
  debug: true,
  testMode: host === 'localhost:3000'
})

export default ReactGA
