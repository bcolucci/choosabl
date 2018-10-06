const { firestore } = require('firebase-admin')

const db = firestore()
db.settings({ timestampsInSnapshots: true })

const collections = require('../collections').reduce(
  (acc, ref) => ({ ...acc, [`${ref}Ref`]: db.collection(ref) }),
  {}
)

module.exports = { db, ...collections }
