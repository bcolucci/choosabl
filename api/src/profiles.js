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

app.get('/:uid', async (req, res) => {
  const { uid } = req.params
  const profile = await profilesRef.doc(uid).get()
  res.json((profile.exists && profile.data()) || {})
})

app.put('/:uid', async (req, res) => {
  const { uid } = req.params
  const { username, birthday, gender } = req.body
  await profilesRef.doc(uid).set({ username, birthday, gender })
  res.end()
})

export default app
