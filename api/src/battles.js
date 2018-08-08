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

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))
app.use(populateCollections())
app.get(`/${idreg('battleUID')}?`, get)
app.get('/availableForVote', availableForVote)

app.post('/', create)

app.put(`/${idreg('battleUID')}/toggleStatus`, isUserBattle, toggleStatus)

app.delete(`/${idreg('battleUID')}`, isUserBattle, remove)

export default app
