const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')

const { version } = require('../package.json')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.get('/ping', (_, res) => res.end('pong'))
app.get('/version', (_, res) => res.end(version))

const createRouter = endpoint => {
  const router = express.Router()
  app.use(endpoint, router)
  // console.log('router', endpoint, 'created')
  return router
}

module.exports = { app, auth, createRouter }
