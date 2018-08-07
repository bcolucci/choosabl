import { authFetch } from '.'

export const getForBattle = async battleId => {
  const res = await authFetch(`votes/${battleId}`)
  return await res.json()
}

export const voteForBattle = async (battleId, vote) => {
  const pVote = +Boolean(+vote)
  await authFetch(`votes/${battleId}/${pVote}`, { method: 'POST' })
}
