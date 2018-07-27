import express from 'express'
import cors from 'cors'
import { auth } from 'firebase-admin'

const app = express()
app.use(cors({ origin: true }))

app.get('/', async (req, res) => {
  const { token } = req.headers
  if (!token) {
    res.status(403)
    res.end('Token required')
    return
  }
  const decodedToken = await auth().verifyIdToken(token)
  res.json(decodedToken)
})

export default app
