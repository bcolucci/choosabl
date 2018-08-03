import { authFetch } from '.'

export const getAllForCurrentUser = async () => {
  const res = await authFetch('battles')
  return await res.json()
}

// export const countForCurrentUser = async () => {
//   const res = await authFetch('battles?count=1')
//   return await res.json()
// }

export const getOneForCurrentUser = async id => {
  const res = await authFetch(`battles/${id}`)
  return await res.json()
}

export const createForCurrentUser = async battle => {
  await authFetch('battles', { method: 'POST', body: battle })
}
