const uuid = require('uuid/v4')
const { photosRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { photo } = req.body
  const userUID = req.header('UserUID')
  const id = uuid()
  const now = new Date().getTime()
  const doc = {
    id,
    user: userUID,
    ...photo,
    createdAt: now,
    updatedAt: now
  }
  await photosRef.doc(id).set(doc)
  res.json(doc)
}
