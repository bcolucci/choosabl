import { geolocated } from 'react-geolocated'

const defaultOpts = {
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
}

export default (opts = {}) => geolocated({ ...defaultOpts, ...opts })
