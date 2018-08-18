const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')
const { populateCollections } = require('./utils/db')
const get = require('./profiles/get')
const create = require('./profiles/create')
const update = require('./profiles/update')
const linkedin = require('./profiles/linkedin')

const app = express()
const auth = createFirebaseAuth({ firebase })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(populateCollections)

app.get('/ping', (_, res) => res.end())
app.get('/', auth, get)

app.get('/auth/linkedin', linkedin)

app.post('/', auth, create)
app.put('/', auth, update)

module.exports = app
