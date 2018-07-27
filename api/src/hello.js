import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({ origin: true }))

app.get('/', (_, res) => {
  const now = new Date().getTime()
  res.end(`Hello from Firebase! ${now}`)
})

export default app
