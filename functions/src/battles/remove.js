const { db, battlesRef, votesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { battleUID } = req.params
  try {
    await Promise.all([
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
