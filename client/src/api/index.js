import { auth } from 'firebase'

export const apiURL =
  (() => {
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
  })() + '/v1'

export const wakeUpAPI = () =>
  fetch(`${apiURL}/ping`, { method: 'HEAD', cache: 'no-cache' })

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
