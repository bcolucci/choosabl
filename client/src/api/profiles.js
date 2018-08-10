import { authFetch } from '.'
import cacheNS from '../utils/cacheNS'

export const getCurrent = async () => {
  const cache = cacheNS('profiles:getCurrent')
  const obj = cache.get()
  if (obj) {
    return obj
  }
  const res = await authFetch('profiles/')
  const profile = await res.json()
  cache.set(profile)
  return profile
}

export const createCurrentProfile = async () => {
  await authFetch('profiles/', { method: 'POST' })
}

export const updateCurrent = async profile => {
  await authFetch('profiles/', { method: 'PUT', body: { profile } })
  cacheNS('profiles:getCurrent').set(profile)
}
