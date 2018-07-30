const apiURL = (() => {
  switch (window.location.host) {
    case 'choosabl.com':
    case 'choosabl-1e2ea.firebaseapp.com':
      return 'https://us-central1-choosabl-1e2ea.cloudfunctions.net'
    case 'choosabl-test.firebaseapp.com':
      return 'https://us-central1-choosabl-test.cloudfunctions.net'
    case 'localhost':
      return 'http://localhost:5000/choosabl-1e2ea/us-central1'
    default:
      throw new Error('Unknown host for API base URL.')
  }
})()

export const getSecret = async token => {
  return await (await fetch(`${apiURL}/secret/`, {
    headers: {
      Authorization: token
    }
  })).json()
}
