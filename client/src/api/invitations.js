import { authFetch } from '.'
import cacheNS from '../utils/cacheNS'

export const invitedList = async () => {
  const cache = cacheNS('invitations:invitedList')
  const invited = cache.get([])
  if (!invited.length) {
    const res = await authFetch('invitations')
    const emails = await res.json()
    cache.set(emails)
    return emails
  }
  return invited
}

export const isInvited = async email => {
  const alreadyInvited = await (await authFetch(`invitations/${email}`)).json()
  if (alreadyInvited) {
    const cache = cacheNS('invitations:invitedList')
    cache.set([...cache.get([]), email])
  }
  return alreadyInvited
}

export const invite = async ({ email, message }) => {
  await authFetch('invitations', {
    method: 'POST',
    body: { invited: email, message }
  })
  const cache = cacheNS('invitations:invitedList')
  cache.set([...cache.get([]), email])
}
