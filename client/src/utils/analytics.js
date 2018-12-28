import 'autotrack'
import conf from '../analytics.json'

window.ga('create', conf[window.location.host], 'auto')

window.ga('require', 'eventTracker')
window.ga('require', 'urlChangeTracker')
