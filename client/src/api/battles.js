import { storage } from 'firebase'
import { authFetch } from '.'
import cacheNS from '../utils/cacheNS'

const bufToB64 = b => new Buffer(b, 'binary').toString('base64')

export const getAllForCurrentUser = async () => {
  const cache = cacheNS('battles:getAllForCurrentUser')
  const obj = cache.get([])
  if (obj && obj.length) {
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
  if (obj && obj.length) {
    return obj
  }
  const res = await authFetch('battles/availableForVote')
  const battles = await res.json()
  cache.set(battles)
  return battles
}

export const downloadPhotos = async battle => {
  // const cache = cacheNS(`battles:downloadPhotos:${battle.id}`)
  // const obj = cache.get()
  // if (obj) {
  //   return obj
  // }
  const [url1, url2] = await Promise.all([
    storage()
      .ref(battle.photo1Path)
      .getDownloadURL(),
    storage()
      .ref(battle.photo2Path)
      .getDownloadURL()
  ])
  const opts = {
    cache: 'force-cache'
  }
  const [res1, res2] = await Promise.all([fetch(url1, opts), fetch(url2, opts)])
  const images = (await Promise.all([
    res1.arrayBuffer(),
    res2.arrayBuffer()
  ])).map(bufToB64)
  // cache.set(images)
  return images
}

export const deleteOne = battle => {
  const cache = cacheNS('battles:getAllForCurrentUser')
  cache.set(cache.get([]).filter(b => b.id !== battle.id))
  return authFetch(`battles/${battle.id}`, { method: 'DELETE' })
}
