const uuid = require('uuid/v4')
const errors = require('../../errors')
const DB = require('../../utils/db')

const create = async ({ userUID, invited, message }) => {
  const nbInvitations = (await DB.invitationsRef
    .where('user', '==', userUID)
    .get()).size
  if (nbInvitations >= 500) {
    return errors.InvitationLimitExceeded
  }
  const iterator = await DB.invitationsRef
    .where('user', '==', userUID)
    .where('invited', '==', invited)
    .get()
  if (iterator.size) {
    return errors.AlreadyInvited
  }
  const now = new Date().getTime()
  const invitation = {
    id: uuid(),
    user: userUID,
    invited,
    message: message.length > 300 ? message.substr(0, 300) + ' [...]' : message,
    createdAt: now
  }
  await DB.invitationsRef.doc(invitation.id).set(invitation)
  return invitation
}

const invitedBy = async userUID => {
  const invited = []
  const iterator = await DB.invitationsRef.where('user', '==', userUID).get()
  iterator.forEach(snap => invited.push(snap.data().invited))
  return invited
}

const isInvited = async ({ userUID, invited }) => {
  const iterator = await DB.invitationsRef
    .where('user', '==', userUID)
    .where('invited', '==', invited)
    .get()
  return !!iterator.size
}

module.exports = {
  create,
  invitedBy,
  isInvited
}
