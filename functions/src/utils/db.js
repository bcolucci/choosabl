const { firestore } = require('firebase-admin')

const db = firestore()
db.settings({ timestampsInSnapshots: true })

const profilesRef = db.collection('profiles')
const battlesRef = db.collection('battles')
const votesRef = db.collection('votes')

module.exports = (_, res, next) => {
  Object.assign(res.locals, { db, profilesRef, battlesRef, votesRef })
  next()
}
