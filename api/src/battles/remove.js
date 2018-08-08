import { storage } from 'firebase-admin'

export default async (req, res) => {
  const { db, battlesRef, votesRef } = res.locals
  const { battleUID } = req.params
  const { battle } = res.locals
  const bucket = storage().bucket()
  try {
    await Promise.all([
      battlesRef.doc(battleUID).delete(),
      bucket.file(battle.photo1Path).delete(),
      bucket.file(battle.photo2Path).delete(),
      votesRef.where('battle', '==', battleUID).get().then(votesSnap => {
        const batch = db.batch()
        votesSnap.forEach(snap => batch.delete(snap.ref))
        return batch.commit()
      })
    ])
  } catch (err) {}
  res.end()
}
