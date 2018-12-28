const { hostname } = require('os')
const admin = require('firebase-admin')
const { https } = require('firebase-functions')
const { app } = require('./src/app')

const corsHandler = require('cors')({ origin: true })

const project = process.env.GCP_PROJECT || 'choosabl-test-71670'
Object.assign(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: `${__dirname}/accounts/${project}.json`,
  CLIENT_URL:
    hostname() === 'localhost'
      ? `https://${project}.firebaseapp.com`
      : 'https://localhost:3000'
})

admin.initializeApp({
  storageBucket: `gs://${project}.appspot.com`
})

require('./src/collections').forEach(col => require(`./src/${col}`))

module.exports.v1 = https.onRequest((req, res) =>
  corsHandler(req, res, () => app(req, res))
)
