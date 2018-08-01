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

export const profiles = {}

profiles.getUserProfile = async () => {
  const user = auth().currentUser
  const token = await user.getIdToken(Math.random() > 0.5)
  return await (await fetch(`${apiURL}/profiles/${user.uid}`, {
    headers: {
      Authorization: token
    }
  })).json()
}

profiles.updateUserProfile = async profile => {
  const user = auth().currentUser
  const token = await user.getIdToken(Math.random() > 0.5)
  await fetch(`${apiURL}/profiles/${user.uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(profile)
  })
}
