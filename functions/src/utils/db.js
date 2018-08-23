const { firestore } = require('firebase-admin')

const db = firestore()
db.settings({ timestampsInSnapshots: true })

const collections = require('../collections').reduce(
  (acc, ref) => ({ ...acc, [`${ref}Ref`]: db.collection(ref) }),
  {}
)

const populateCollections = (_, res, next) => {
  Object.assign(res.locals, { db, ...collections })
  next()
}

module.exports = { db, populateCollections, collections }
