const uuid = require('uuid/v4')
const { detectBattleFaces } = require('../utils/vision')

module.exports = async (req, res) => {
  const { battlesRef } = res.locals
  const userUID = req.header('UserUID')
  const id = uuid()
  const { battle } = req.body
  const now = new Date().getTime()
  const doc = {
    ...battle,
    id,
    user: userUID,
    active: false,
    createdAt: now,
    updatedAt: now
  }
  await detectBattleFaces(battle)
  await Promise.all([battlesRef.doc(id).set(doc)])
  res.json(doc)
}
