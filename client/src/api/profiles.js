import { authFetch } from '.'

export const getCurrent = async () => {
  const res = await authFetch('profiles')
  return await res.json()
}

export const updateCurrent = async profile => {
  await authFetch('profiles', { method: 'PUT', body: profile })
}
