const { storage } = require('firebase-admin')

const removeBattleFiles = ({ photo1Path, photo2Path }) => {
  const bucket = storage().bucket()
  return Promise.all([
    bucket.file(photo1Path).delete(),
    bucket.file(photo2Path).delete(),
    bucket.file(photo1Path.replace('/photos', '/vision')).delete(),
    bucket.file(photo2Path.replace('/photos', '/vision')).delete()
  ])
}

module.exports = async (req, res) => {
  const { db, battlesRef, votesRef } = res.locals
  const { battleUID } = req.params
  const { battle } = res.locals
  try {
    await Promise.all([
      removeBattleFiles(battle),
      battlesRef.doc(battleUID).delete(),
      votesRef
        .where('battle', '==', battleUID)
        .get()
        .then(votesSnap => {
          const batch = db.batch()
          votesSnap.forEach(snap => batch.delete(snap.ref))
          return batch.commit()
        })
    ])
  } catch (err) {}
  res.end()
}
