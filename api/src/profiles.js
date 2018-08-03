import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import db from './db'

const profilesRef = db.collection('profiles')

const app = express()
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))

app.get('/', async (req, res) => {
  const UserUID = req.header('UserUID')
  const profile = await profilesRef.doc(UserUID).get()
  res.json((profile.exists && profile.data()) || {})
})

app.put('/', async (req, res) => {
  const UserUID = req.header('UserUID')
  const { username, birthday, gender } = req.body
  await profilesRef.doc(UserUID).set({ username, birthday, gender })
  res.end()
})

export default app
