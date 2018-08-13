const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')
const populateCollections = require('./utils/db')
const idreg = require('./utils/idreg')
const get = require('./battles/get')
const create = require('./battles/create')
const availableForVote = require('./battles/availableForVote')
const toggleStatus = require('./battles/toggleStatus')
const remove = require('./battles/remove')
const isUserBattle = require('./battles/isUserBattleHandler')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections)

app.get('/ping', (_, res) => res.end())
app.get(`/${idreg('battleUID')}?`, auth, get)
app.get('/availableForVote', auth, availableForVote)

app.post('/', auth, create)

app.put(`/${idreg('battleUID')}/toggleStatus`, auth, isUserBattle, toggleStatus)

app.delete(`/${idreg('battleUID')}`, auth, isUserBattle, remove)

module.exports = app
