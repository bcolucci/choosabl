import admin from 'firebase-admin'

const project = process.env.GCP_PROJECT || 'choosabl-test'
Object.assign(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: `${__dirname}/accounts/${project}.json`
})

admin.initializeApp()
