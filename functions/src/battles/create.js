const uuid = require('uuid/v4')
const populatePhotos = require('./populatePhotos')
const { detectBattleFaces } = require('../utils/vision')
const { battlesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const id = uuid()
  const { battle } = req.body
  const now = new Date().getTime()
  const doc = {
    ...battle,
    id,
    user: userUID,
    active: false,
    publishedAt: null,
    createdAt: now,
    updatedAt: now
  }
  await detectBattleFaces({ battle, persist: true })
  await Promise.all([battlesRef.doc(id).set(doc)])
  await populatePhotos(doc)
  res.json(doc)
}
