const { photosRef } = require('../utils/db').collections

const populatePhotos = async battle => {
  const [photo1, photo2] = await Promise.all(
    ['photo1', 'photo2'].map(field =>
      photosRef
        .where('id', '==', battle[field])
        .limit(1)
        .get()
        .then(snap => snap.docs[0].data())
    )
  )
  Object.assign(battle, { photo1, photo2 })
}

module.exports = async (req, res) => {
  const { battlesRef } = res.locals
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
  await Promise.all(battles.map(battle => populatePhotos(battle)))
  res.json(battles)
}
