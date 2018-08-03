import { https } from 'firebase-functions'
import profiles from './src/profiles'
import battles from './src/battles'

exports.profiles = https.onRequest(profiles)
exports.battles = https.onRequest(battles)
