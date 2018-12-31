const { auth } = require('firebase-admin')
const repository = require('./repository')
const mailer = require('../utils/mailer')
const invitationMail = require('../mails/invitation')

const create = async (req, res, next) => {
  const { invited, message } = req.body
  const userUID = req.header('UserUID')
  const [invitation, currentUser] = await Promise.all([
    repository.create({ userUID, invited, message }),
    auth().getUser(userUID)
  ])
  setTimeout(() => res.end(invitation), mailer.TIMEOUT)
  mailer.sendMail(
    invitationMail({
      referrer: currentUser,
      email: invited,
      message
    }),
    err => {
      if (err) {
        return next(err)
      }
      try {
        res.json(invitation) // maybe already closed
      } catch (err) {}
    }
  )
}

const invitedBy = (req, res, next) => {
  const userUID = req.header('UserUID')
  repository
    .invitedBy(userUID)
    .then(invited => res.json(invited))
    .catch(err => next(err))
}

const isInvited = (req, res, next) => {
  const { invited } = req.params
  repository
    .isInvited({ userUID, invited })
    .then(isInvited => res.json(isInvited))
    .catch(err => next(err))
}

module.exports = {
  create,
  invitedBy,
  isInvited
}
