import { authFetch } from '.'

export const getAllForCurrentUser = async () => {
  const res = await authFetch('battles')
  return await res.json()
}

export const getOneForCurrentUser = async id => {
  const res = await authFetch(`battles/${id}`)
  return await res.json()
}

export const createForCurrentUser = async (battle, crops) =>
  await authFetch('battles', { method: 'POST', body: { battle, crops } })

export const toggleBattleStatus = async battle =>
  await authFetch(`battles/${battle.id}/toggleStatus`, { method: 'PUT' })

export const getAvailablesForCurrentUser = async () => {
  const res = await authFetch('battles/availableForVote')
  return await res.json()
}

export const deleteOne = async battle =>
  authFetch(`battles/${battle.id}`, { method: 'DELETE' })
