import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import { populateCollections } from './utils/db'
import get from './votes/get'
import create from './votes/create'
import idreg from './utils/idreg'

const app = express()
const auth = createFirebaseAuth({ firebase })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections())

app.get('/ping', (_, res) => res.end())
app.get(`/${idreg('battleUID')}`, auth, get)

app.post(`/${idreg('battleUID')}/:voteFor(0|1)`, auth, create)

export default app
