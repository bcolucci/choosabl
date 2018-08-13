const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')
const populateCollections = require('./utils/db')
const get = require('./votes/get')
const create = require('./votes/create')
const idreg = require('./utils/idreg')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections)

app.get('/ping', (_, res) => res.end())
app.get(`/${idreg('battleUID')}`, auth, get)

app.post(`/${idreg('battleUID')}/:voteFor(0|1)`, auth, create)

module.exports = app
