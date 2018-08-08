import { https } from 'firebase-functions'
import profiles from './src/profiles'
import battles from './src/battles'
import votes from './src/votes'

const { GCP_PROJECT } = process.env
Object.assign(process.env, {
  GOOGLE_APPLICATION_CREDENTIALS: `${__dirname}/accounts/${GCP_PROJECT}.json`
})

exports.profiles = https.onRequest(profiles)
exports.battles = https.onRequest(battles)
exports.votes = https.onRequest(votes)
