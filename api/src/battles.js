import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import { populateCollections } from './utils/db'
import idreg from './utils/idreg'
import get from './battles/get'
import create from './battles/create'
import availableForVote from './battles/availableForVote'
import toggleStatus from './battles/toggleStatus'
import remove from './battles/remove'
import isUserBattle from './battles/isUserBattleHandler'

const app = express()
const auth = createFirebaseAuth({ firebase })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections())

app.get('/ping', (_, res) => res.end())
app.get(`/${idreg('battleUID')}?`, auth, get)
app.get('/availableForVote', auth, availableForVote)

app.post('/', auth, create)

app.put(`/${idreg('battleUID')}/toggleStatus`, auth, isUserBattle, toggleStatus)

app.delete(`/${idreg('battleUID')}`, auth, isUserBattle, remove)

export default app
