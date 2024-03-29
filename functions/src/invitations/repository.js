const uuid = require('uuid/v4')
const errors = require('../errors')
const DB = require('../utils/mysql')

const MAX_INVITATIONS = 500
const MAX_MESSAGE_LENGTH = 300

const getNbUserInvitations = userUID =>
  DB.queryFirstScalar('SELECT COUNT(*) FROM invitations WHERE user = ?', [
    userUID
  ])

const isInvited = ({ userUID, invited }) =>
  DB.queryFirstScalar(
    'SELECT COUNT(*) FROM invitations WHERE user = ? AND invited = ?',
    [userUID, invited]
  ).then(res => res > 0)

const create = async ({ userUID, invited, message }) => {
  const invitationExists = await isInvited({ userUID, invited })
  if (invitationExists) {
    return errors.AlreadyInvited
  }
  const nbInvitations = await getNbUserInvitations(userUID)
  if (nbInvitations >= MAX_INVITATIONS) {
    return errors.InvitationLimitExceeded
  }
  const now = new Date()
  const invitation = {
    id: uuid(),
    user: userUID,
    invited,
    message:
      message.length > MAX_MESSAGE_LENGTH
        ? message.substr(0, MAX_MESSAGE_LENGTH) + ' [...]'
        : message,
    createdAt: now
  }
  await DB.insert('invitations', invitation)
  return invitation
}

const invitedBy = userUID =>
  DB.query(
    'SELECT invited FROM invitations WHERE user = ? ORDER BY createdAt DESC LIMIT ?',
    [userUID, MAX_INVITATIONS]
  ).then(rows => rows.map(global.pickAttr('invited')))

const remove = ({ userUID, invited }) =>
  DB.delete('invitations', { user: userUID, invited })

module.exports = {
  isInvited,
  create,
  invitedBy,
  remove
}
