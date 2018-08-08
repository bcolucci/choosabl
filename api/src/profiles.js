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
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))
app.use(populateCollections())

app.get('/', get)

app.post('/', create)
app.put('/', update)

export default app
