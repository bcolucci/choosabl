import { firestore } from 'firebase-admin'

const db = firestore()
db.settings({ timestampsInSnapshots: true })

const profilesRef = db.collection('profiles')
const battlesRef = db.collection('battles')
const votesRef = db.collection('votes')

const populateHandler = (_, res, next) => {
  Object.assign(res.locals, { db, profilesRef, battlesRef, votesRef })
  next()
}

export const populateCollections = () => populateHandler

export default db
