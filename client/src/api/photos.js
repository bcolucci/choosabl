import { authFetch } from '.'
// import cacheNS from '../utils/cacheNS'

// TODO fix cache (take in account that the 'used' indicator can change)

export const getForCurrentUser = async () => {
  // const cache = cacheNS('photos:getForCurrentUser')
  // const obj = cache.get([])
  // if (obj.length) {
  //   return obj
  // }
  const res = await authFetch('photos')
  const photos = await res.json()
  return photos
}

export const detectingFace = async path => {
  const res = await authFetch(`photos/face/${btoa(path)}`)
  const faces = await res.json()
  return faces
}

export const createPhoto = async photo => {
  const res = await authFetch('photos', { method: 'POST', body: { photo } })
  const created = await res.json()
  // const cache = cacheNS('photos:getForCurrentUser')
  // cache.set([created, ...cache.get([])])
  return created
}

export const deleteOne = async ({ id, path }) => {
  return authFetch(`photos/${id}/${btoa(path)}`, { method: 'DELETE' })
}
