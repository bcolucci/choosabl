const { hostname } = require('os')
const admin = require('firebase-admin')
const { https } = require('firebase-functions')
const { app } = require('./src/app')

global.unique = (v, i, arr) => arr.indexOf(v) === i
global.pickAttr = attr => obj => obj[attr]

const DEV_PROJECT_ID = 'choosabl-test-71670'
const GCP_PROJECT = process.env.GCP_PROJECT || DEV_PROJECT_ID
const DEV_ENV = GCP_PROJECT === DEV_PROJECT_ID
const GOOGLE_APPLICATION_CREDENTIALS = `${__dirname}/accounts/${GCP_PROJECT}.json`

const CLIENT_URL =
  hostname() === 'localhost'
    ? `https://${GCP_PROJECT}.firebaseapp.com`
    : 'https://localhost:3000'

Object.assign(process.env, {
  GCP_PROJECT,
  DEV_ENV,
  GOOGLE_APPLICATION_CREDENTIALS,
  CLIENT_URL
})
// console.log(JSON.stringify(process.env, null, 2))

admin.initializeApp({ storageBucket: `gs://${GCP_PROJECT}.appspot.com` })

require('./src/collections').forEach(col => require(`./src/${col}`))

const corsHandler = require('cors')({ origin: true })

module.exports.v1 = https.onRequest((req, res) => {
  // if (DEV_ENV) {
  //   console.log('Request:', req.method, req.url)
  // }
  corsHandler(req, res, () => app(req, res))
})
