const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')
const { populateCollections } = require('./utils/db')
const isInvited = require('./invitations/isInvited')
const invited = require('./invitations/invited')
const create = require('./invitations/create')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections)

app.head('/ping', (_, res) => res.end())

app.get('/', auth, invited)
app.get('/:invited', auth, isInvited)

app.post('/', auth, create)

module.exports = app
