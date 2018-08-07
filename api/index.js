import { https } from 'firebase-functions'
import profiles from './src/profiles'
import battles from './src/battles'
import votes from './src/votes'

exports.profiles = https.onRequest(profiles)
exports.battles = https.onRequest(battles)
exports.votes = https.onRequest(votes)
