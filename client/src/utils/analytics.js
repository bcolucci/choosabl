import 'autotrack'

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

window.ga('create', code, 'auto')

window.ga('require', 'eventTracker')
window.ga('require', 'urlChangeTracker')
