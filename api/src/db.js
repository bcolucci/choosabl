import admin from 'firebase-admin'

admin.initializeApp()

const db = admin.firestore()

export const messagesRef = db.collection('messages')

export default db
