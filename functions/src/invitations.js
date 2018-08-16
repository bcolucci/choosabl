const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')
const populateCollections = require('./utils/db')
const invited = require('./invitations/invited')
const create = require('./invitations/create')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections)

app.get('/ping', (_, res) => res.end())
app.get('/:invited', auth, invited)

app.post('/:invited', auth, create)

module.exports = app
