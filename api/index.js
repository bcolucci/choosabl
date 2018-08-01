import { https } from 'firebase-functions'
import profiles from './src/profiles'

exports.profiles = https.onRequest(profiles)
