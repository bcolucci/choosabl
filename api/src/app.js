import express from 'express'
import cors from 'cors'
import hello from './hello'
import secret from './secret'
import messagesRouter from './messages'

console.log(process.env)

const app = express()
app.use(cors({ origin: true }))

app.get('/hello', hello)
app.get('/secret', secret)

app.use('/messages', messagesRouter)

export default app
