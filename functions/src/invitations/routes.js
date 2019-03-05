const { auth } = require('firebase-admin')
const repository = require('./repository')
const mailer = require('../utils/mailer')
const invitationMail = require('./mails/invitation')

const create = async (req, res, next) => {
  const { invited, message } = req.body
  const userUID = req.header('UserUID')
  const [invitation, currentUser] = await Promise.all([
    repository.create({ userUID, invited, message }),
    auth().getUser(userUID)
  ])
  const mail = await invitationMail({
    referrer: currentUser,
    email: invited,
    message
  })
  setTimeout(() => res.end(invitation), mailer.TIMEOUT)
  mailer.sendMail(mail, err => {
    if (err) {
      return next(err)
    }
    try {
      res.json(invitation) // maybe already closed
    } catch (err) {}
  })
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
  const userUID = req.header('UserUID')
  repository
    .isInvited({ userUID, invited })
    .then(isInvited => res.json(isInvited))
    .catch(err => next(err))
}

const remove = (req, res, next) => {
  const { invited } = req.body
  const userUID = req.header('UserUID')
  repository
    .remove({ userUID, invited })
    .then(() => res.end())
    .catch(err => next(err))
}

module.exports = {
  create,
  invitedBy,
  isInvited,
  remove
}
