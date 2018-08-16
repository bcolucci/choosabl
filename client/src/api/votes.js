import { authFetch } from '.'
import cacheNS from '../utils/cacheNS'

export const getForBattle = async battleId => {
  const res = await authFetch(`votes/${battleId}`)
  const votes = await res.json()
  return votes
}

export const voteForBattle = async (battleId, vote) => {
  const pVote = +Boolean(+vote)
  await authFetch(`votes/${battleId}/${pVote}`, { method: 'POST' })
  // erk...
  const cache = cacheNS('battles:getAvailablesForCurrentUser')
  cache.set(cache.get([]).slice(1))
}
