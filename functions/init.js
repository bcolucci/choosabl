const { hostname } = require('os')
const firebase = require('firebase-admin')

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
