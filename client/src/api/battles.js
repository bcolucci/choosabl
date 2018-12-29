import { storage } from 'firebase'
import { CACHE_ACTIVATED, authFetch } from '.'
import cacheNS from '../utils/cacheNS'
import * as base64Img from '../utils/base64Img'

export const getAllForCurrentUser = async () => {
  const cache = cacheNS('battles:getAllForCurrentUser')
  const obj = cache.get([])
  if (CACHE_ACTIVATED && obj && obj.length) {
    return obj
  }
  const res = await authFetch('battles/')
  const battles = await res.json()
  cache.set(battles)
  return battles
}

export const getOneForCurrentUser = async id => {
  const res = await authFetch(`battles/${id}`)
  return await res.json()
}

export const createForCurrentUser = async battle => {
  const res = await authFetch('battles/', { method: 'POST', body: { battle } })
  const newBattle = await res.json()
  const cache = cacheNS('battles:getAllForCurrentUser')
  cache.set([newBattle, ...cache.get([])])
}

export const toggleBattleStatus = async battle => {
  await authFetch(`battles/${battle.id}/toggleStatus`, { method: 'PUT' })
  const cache = cacheNS('battles:getAllForCurrentUser')
  const battles = cache.get([])
  cache.set(
    battles.map(b => (b.id !== battle.id ? b : { ...b, active: !b.active }))
  )
}

export const getAvailablesForCurrentUser = async () => {
  const cache = cacheNS('battles:getAvailablesForCurrentUser')
  const obj = cache.get([])
  if (CACHE_ACTIVATED && obj && obj.length) {
    return obj
  }
  const res = await authFetch('battles/availableForVote')
  const battles = await res.json()
  cache.set(battles)
  return battles
}

export const downloadPhotos = async battle => {
  const [url1, url2] = await Promise.all([
    storage()
      .ref(battle.photo1.path)
      .getDownloadURL(),
    storage()
      .ref(battle.photo2.path)
      .getDownloadURL()
  ])
  const images = await Promise.all([
    base64Img.download(url1),
    base64Img.download(url2)
  ])
  return images
}

export const deleteOne = battle => {
  const cache = cacheNS('battles:getAllForCurrentUser')
  cache.set(cache.get([]).filter(b => b.id !== battle.id))
  return authFetch(`battles/${battle.id}`, { method: 'DELETE' })
}

export const statsForOne = async battle => {
  const res = await authFetch(`battles/stats/${battle.id}`)
  return await res.json()
}
