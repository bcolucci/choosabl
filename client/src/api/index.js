import { auth } from 'firebase'

const apiURL = (() => {
  switch (window.location.host) {
    case 'choosabl.com':
    case 'choosabl-1e2ea.firebaseapp.com':
      return 'https://us-central1-choosabl-1e2ea.cloudfunctions.net'
    case 'choosabl-test.firebaseapp.com':
      return 'https://us-central1-choosabl-test.cloudfunctions.net'
    case 'localhost:3000':
      return 'http://localhost:5000/choosabl-test/us-central1'
    default:
      throw new Error('Unknown host (API).')
  }
})()

export const wakeUpAllAPI = () => {
  const opts = { cache: 'no-cache' }
  return Promise.all([
    fetch(`${apiURL}/profiles/ping`, opts),
    fetch(`${apiURL}/battles/ping`, opts),
    fetch(`${apiURL}/votes/ping`, opts)
  ])
}

export const authFetch = async (uri, customs = {}) => {
  const { currentUser } = auth()
  const token = await currentUser.getIdToken(Math.random() > 0.9)
  const params = {
    headers: {
      'Content-Type': 'application/json',
      UserUID: currentUser.uid,
      Authorization: token
    }
  }
  if (customs.body) {
    customs.body = JSON.stringify(customs.body)
  }
  return fetch(`${apiURL}/${uri}`, { ...params, ...customs })
}
