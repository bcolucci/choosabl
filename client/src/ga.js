import ReactGA from 'react-ga'

ReactGA.initialize(
  (() => {
    const { host } = window.location
    if (host === 'choosabl.com') {
      return 'UA-127456637-1'
    }
    if (host === 'choosabl-test.firebaseapp.com') {
      return 'UA-127382235-1'
    }
    return null
  })()
)

export default ReactGA
