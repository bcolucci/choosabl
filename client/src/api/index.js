import { auth } from 'firebase'
import apiUrls from '../api-urls.json'

export const apiURL = apiUrls[window.location.host] + '/v1'

export const wakeUpAPI = () => fetch(`${apiURL}/ping`, { cache: 'no-cache' })

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
