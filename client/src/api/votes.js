import { authFetch } from '.'

export const getForBattle = async battleId => {
  const res = await authFetch(`votes/${battleId}`)
  const votes = await res.json()
  return votes
}

export const voteForBattle = async (battleId, vote) => {
  const pVote = +Boolean(+vote)
  await authFetch(`votes/${battleId}/${pVote}`, { method: 'POST' })
}
