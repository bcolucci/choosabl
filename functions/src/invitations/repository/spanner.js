const uuid = require('uuid/v4')
const errors = require('../../errors')
const DB = require('../../utils/spanner')

const MAX_INVITATIONS = 500
const MAX_MESSAGE_LENGTH = 300

const getNbUserInvitations = userUID =>
  DB.run({
    sql: 'SELECT id FROM invitations WHERE user = @userUID',
    params: { userUID }
  }).then(([rows]) => rows.length)

const isInvited = ({ userUID, invited }) =>
  DB.run({
    sql: 'SELECT id FROM invitations WHERE user = @userUID invited = @invited',
    params: { userUID, invited }
  }).then(([rows]) => rows.length > 0)

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
  await DB.table('invitations').insert([invitation])
  return invitation
}

const invitedBy = userUID =>
  DB.run({
    sql: 'SELECT invited FRON invitations WHERE user = @userUID',
    params: { userUID },
    json: true
  })
    .then(all)
    .then(rows => rows.map(({ invited }) => invited))

module.exports = {
  isInvited,
  create,
  invitedBy
}
