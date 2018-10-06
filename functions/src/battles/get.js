const populatePhotos = require('./populatePhotos')
const { battlesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  if (battleUID) {
    const battle = await battlesRef.doc(battleUID).get()
    if (!battle.exists) {
      return res.status(500).end('Not found.')
    }
    if (battle.user !== userUID) {
      return res.status(500).end('Not allowed.')
    }
    return res.json(battle)
  }
  const battles = []
  const iterator = await battlesRef
    .where('user', '==', userUID)
    .orderBy('updatedAt', 'desc')
    .get()
  iterator.forEach(snap => battles.push(snap.data()))
  await Promise.all(battles.map(populatePhotos))
  res.json(battles)
}
