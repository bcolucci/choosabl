import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import sillyname from 'sillyname'
import db from './utils/db'

const profilesRef = db.collection('profiles')

const app = express()
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))

app.get('/', async (req, res) => {
  const userUID = req.header('UserUID')
  const profile = await profilesRef.doc(userUID).get()
  res.json((profile.exists && profile.data()) || {})
})

app.post('/', async (req, res) => {
  const userUID = req.header('UserUID')
  const profileSnap = await profilesRef.doc(userUID).get()
  if (!profileSnap.exists) {
    const now = new Date().getTime()
    const username = `${sillyname()} ${Math.ceil(Math.random() * 99)}`
    await profilesRef.doc(userUID).set({
      username,
      birthday: null,
      gender: '',
      votes: 3,
      createdAt: now,
      updatedAt: now
    })
  }
  res.end()
})

app.put('/', async (req, res) => {
  const userUID = req.header('UserUID')
  const { username, birthday, gender } = req.body
  const now = new Date().getTime()
  await profilesRef.doc(userUID).set({
    username,
    birthday,
    gender,
    updatedAt: now
  })
  res.end()
})

export default app
