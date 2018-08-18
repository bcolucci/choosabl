const { auth } = require('firebase-admin')
const uuid = require('uuid')
const mailer = require('../utils/mailer')
const invitationMail = require('../mails/invitation')

module.exports = async (req, res) => {
  const { invitationsRef } = res.locals
  const { invited, message } = req.body
  const userUID = req.header('UserUID')
  const nbInvitations = (await invitationsRef
    .where('user', '==', userUID)
    .get()).size
  if (nbInvitations >= 500) {
    return res.status(500).end('Invitation limit exceeded.')
  }
  const iterator = await invitationsRef
    .where('user', '==', userUID)
    .where('invited', '==', invited)
    .get()
  if (iterator.size) {
    return res.status(500).end('Already invited.')
  }
  const now = new Date().getTime()
  const invitation = {
    id: uuid(),
    user: userUID,
    invited,
    message: message.length > 300 ? message.substr(0, 300) + ' [...]' : message,
    createdAt: now
  }
  await invitationsRef.doc(invitation.id).set(invitation)
  const currentUser = await auth().getUser(userUID)
  mailer.sendMail(
    invitationMail({
      referrer: currentUser,
      email: invited,
      message
    }),
    err => {
      if (err) {
        error = err
        return res.status(500).end(err.message)
      }
      try {
        res.end() // maybe already closed
      } catch (err) {}
    }
  )
  setTimeout(() => res.end(), 3000)
}
