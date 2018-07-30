import express from 'express'
import cors from 'cors'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'

const app = express()
app.use(cors({ origin: true }))
app.use(createFirebaseAuth({ firebase }))

app.get('/', async (req, res) => {
  res.json({ secret: 'Your are authenticated' })
})

export default app
