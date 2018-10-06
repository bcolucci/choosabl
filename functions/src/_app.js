const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const { createFirebaseAuth } = require('express-firebase-auth')

const app = express()
const auth = createFirebaseAuth({ firebase, checkEmailVerified: true })

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.head('/ping', (_, res) => res.end())

module.exports = {
  app,
  auth,
  createRouter: endpoint => {
    const router = express.Router()
    app.use(endpoint, router)
    return router
  }
}
