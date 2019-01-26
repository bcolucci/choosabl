const uuid = require('uuid/v4')
const errors = require('../../errors')
const DB = require('../../utils/mysql')

const MAX_INVITATIONS = 500
const MAX_MESSAGE_LENGTH = 300

const getNbUserInvitations = userUID =>
  DB.queryFirstScalar('SELECT COUNT(*) FROM invitations WHERE user = ?', [
    userUID
  ])

const isInvited = ({ userUID, invited }) =>
  DB.queryFirstScalar(
    'SELECT 1 FROM invitations WHERE user = ? invited = ? LIMIT 1',
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
  DB.query('SELECT invited FRON invitations WHERE user = ?', [userUID]).then(
    rows => rows.map(global.pickAttr('invited'))
  )

module.exports = {
  isInvited,
  create,
  invitedBy
}
