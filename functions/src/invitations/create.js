const { auth } = require('firebase-admin')
const uuid = require('uuid')
const mailer = require('../utils/mailer')
const invitationMail = require('../mails/invitation')

module.exports = async (req, res) => {
  const { invitationsRef } = res.locals
  const { invited } = req.params
  const userUID = req.header('UserUID')
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
    createdAt: now
  }
  await invitationsRef.doc(invitation.id).set(invitation)
  const currentUser = await auth().getUser(userUID)
  mailer.sendMail(
    invitationMail({
      referrer: currentUser,
      email: invited
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
