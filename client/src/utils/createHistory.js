import createHistory from 'history/createBrowserHistory'
import analytics from './analytics'

export default () => {
  const history = createHistory()
  history.listen(location => {
    analytics.set({ page: location.pathname })
    analytics.pageview(location.pathname)
  })
  return history
}
