import withAnalytics from './withAnalytics'
import withGeoLoc from './withGeoLoc'
import withIntl from './withIntl'
import withMsgSnack from './withMsgSnack'
import withRouter from './withRouter'
import withStyles from './withStyles'

const bindings = {
  withAnalytics,
  withGeoLoc,
  withIntl,
  withMsgSnack,
  withRouter,
  withStyles
}

export default (component, opts = {}) =>
  Object.keys(bindings).reduce(
    (bindedComp, opt) =>
      opts[opt]
        ? bindings[opt](opts[opt] === true ? undefined : opts[opt])(bindedComp)
        : bindedComp,
    component
  )
