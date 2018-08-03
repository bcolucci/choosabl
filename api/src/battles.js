import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import db from './db'

const battlesRef = db.collection('battles')

const app = express()
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))

app.get('/:id?', async (req, res) => {
  const UserUID = req.header('UserUID')
  const { id } = req.params
  if (id) {
    const battle = await battlesRef.doc(id).get()
    if (!battle.exists) {
      return res.status(500).end('Not found.')
    }
    if (battle.user !== UserUID) {
      return res.status(500).end('Not allowed.')
    }
    return res.json(battle)
  }
  // const snap = battlesRef.where('user', '==', UserUID)
  // if (+req.query.count) {
  //   const active = (await snap.where('active', '==', true).get()).size
  //   const draft = (await snap.where('active', '==', false).get()).size
  //   return res.json({ active, draft })
  // }
  const battles = []
  const iterator = await battlesRef.where('user', '==', UserUID).get()
  iterator.forEach(battle => battles.push(battle.data()))
  res.json(battles)
})

app.post('/', async (req, res) => {
  const UserUID = req.header('UserUID')
  await battlesRef.add({ user: UserUID, active: false, ...req.body })
  res.end()
})

export default app
