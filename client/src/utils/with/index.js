import withGeoLoc from './withGeoLoc'
import withIntl from './withIntl'
import withMsgSnack from './withMsgSnack'
import withRouter from './withRouter'
import withStyles from './withStyles'
import withTracker from './withTracker'

const bindings = {
  withGeoLoc,
  withIntl,
  withMsgSnack,
  withRouter,
  withStyles,
  withTracker
}

export default (component, opts = {}) =>
  Object.keys(bindings).reduce(
    (bindedComp, opt) =>
      opts[opt]
        ? bindings[opt](opts[opt] === true ? undefined : opts[opt])(bindedComp)
        : bindedComp,
    component
  )
