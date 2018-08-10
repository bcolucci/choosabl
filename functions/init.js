const firebase = require('firebase-admin')

const project = process.env.GCP_PROJECT || 'choosabl-test'
Object.assign(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: `${__dirname}/accounts/${project}.json`
})

firebase.initializeApp({
  storageBucket: `gs://${project}.appspot.com`
})
