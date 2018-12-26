const { hostname } = require('os')
const firebase = require('firebase-admin')
const { https } = require('firebase-functions')
const { app } = require('./src/app')

const corsHandler = require('cors')({ origin: true })

const project = process.env.GCP_PROJECT || 'choosabl-test'
Object.assign(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: `${__dirname}/accounts/${project}.json`,
  CLIENT_URL:
    hostname() === 'localhost'
      ? `https://${project}.firebaseapp.com`
      : 'http://localhost:3000'
})

firebase.initializeApp({
  storageBucket: `gs://${project}.appspot.com`
})

require('./src/collections').forEach(col => require(`./src/${col}`))

module.exports.v1 = https.onRequest((req, res) => {
  corsHandler(req, res, () => app(req, res))
})
