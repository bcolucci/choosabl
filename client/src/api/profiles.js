import { CACHE_ACTIVATED, authFetch } from '.'
import cacheNS from '../utils/cacheNS'

export const getCurrent = async () => {
  const cache = cacheNS('profiles:getCurrent')
  const obj = cache.get()
  if (CACHE_ACTIVATED && obj) {
    return obj
  }
  const res = await authFetch('profiles/')
  const profile = await res.json()
  cache.set(profile)
  return profile
}

export const createCurrentProfile = async email => {
  const referrer = localStorage.getItem('referrer')
  localStorage.removeItem('referrer')
  return await authFetch(`profiles/?referrer=${referrer}`, {
    method: 'POST',
    body: { email }
  })
}

export const updateCurrent = async profile => {
  await authFetch('profiles/', { method: 'PUT', body: { profile } })
  cacheNS('profiles:getCurrent').set(profile)
}

export const currentProfileStats = async () => {
  const cache = cacheNS('profiles:currentStats', 30 * 1000)
  const obj = cache.get()
  if (CACHE_ACTIVATED && obj) {
    return obj
  }
  const res = await authFetch('profiles/stats')
  const stats = await res.json()
  cache.set(stats)
  return stats
}
