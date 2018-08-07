import admin from 'firebase-admin'

admin.initializeApp()

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

export default db
