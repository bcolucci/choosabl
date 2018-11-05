const { auth } = require('firebase-admin')
const repository = require('./repository')
const mailer = require('../utils/mailer')
const invitationMail = require('../mails/invitation')

const create = async (req, res) => {
  const { invited, message } = req.body
  const userUID = req.header('UserUID')
  const invitation = await repository.create({ userUID, invited, message })
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
        res.end(invitation) // maybe already closed
      } catch (err) {}
    }
  )
  setTimeout(() => res.end(invitation), 3000)
}

const invitedBy = async (req, res) => {
  const userUID = req.header('UserUID')
  const invited = await repository.invitedBy(userUID)
  res.json(invited)
}

const isInvited = async (req, res) => {
  const { invited } = req.params
  const isInvited = await repository.isInvited({ userUID, invited })
  res.json(isInvited)
}

module.exports = {
  create,
  invitedBy,
  isInvited
}
