const express = require('express')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')
// const timeHandler = require('./utils/timerHandler')

const { version } = require('../package.json')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(bodyParser.json())
// app.use(timeHandler)
app.get('/ping', (_, res) => res.end('pong'))
app.get('/version', (_, res) => res.end(version))

const createRouter = endpoint => {
  const router = express.Router()
  app.use(endpoint, router)
  return router
}

module.exports = { app, auth, createRouter }
