import express from 'express'
import cors from 'cors'
import { messagesRef } from './db'

const app = express()
app.use(cors({ origin: true }))

const getMessages = async () => {
  const messages = []
  const snap = await messagesRef.get()
  snap.forEach(doc => messages.push(doc.data()))
  return messages
}

app.get('/', async (req, res) => {
  const messages = await getMessages()
  res.json(messages)
})

app.post('/', async (_, res) => {
  await messagesRef.add({ text: casual.sentence })
  res.end()
})

app.delete('/:id', async (req, res) => {
  const { id } = req.params
  await messagesRef.doc(id).delete()
  res.end()
})

export default app
