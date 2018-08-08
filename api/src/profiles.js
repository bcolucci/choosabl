import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import { populateCollections } from './utils/db'
import get from './profiles/get'
import create from './profiles/create'
import update from './profiles/update'

const app = express()
const auth = createFirebaseAuth({ firebase })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections())

app.get('/ping', (_, res) => res.end())
app.get('/', auth, get)

app.post('/', auth, create)
app.put('/', auth, update)

export default app
