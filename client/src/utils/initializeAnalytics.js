import ReactGA from 'react-ga'
import conf from '../analytics.json'

const trackingId = conf[window.location.host]

ReactGA.initialize([
  {
    trackingId,
    debug: true,
    gaOptions: {
      cookieDomain: 'none'
    }
  }
])
