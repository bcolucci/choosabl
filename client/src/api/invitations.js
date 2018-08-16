import { authFetch } from '.'
import cacheNS from '../utils/cacheNS'

export const alreadyInvited = async email => {
  const cache = cacheNS('invitations:alreadyInvited')
  const invited = cache.get()
  if (!invited || !Object.keys(invited).includes(email)) {
    const res = await authFetch(`invitations/${email}`)
    const json = await res.json()
    cache.set({ ...invited, [email]: json.invited })
    return json.invited
  }
  return !!invited[email]
}

export const invite = async email => {
  await authFetch(`invitations/${email}`, { method: 'POST' })
  const cache = cacheNS('invitations:alreadyInvited')
  const invited = cache.get()
  cache.set({ ...invited, [email]: true })
}
