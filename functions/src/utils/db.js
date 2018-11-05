const { firestore } = require('firebase-admin')

const db = firestore()
db.settings({ timestampsInSnapshots: true })

const collections = require('../collections').reduce(
  (acc, ref) => ({ ...acc, [`${ref}Ref`]: db.collection(ref) }),
  {}
)

const batch = db.batch.bind(db)

module.exports = { db, batch, ...collections }
