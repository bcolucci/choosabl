import { https } from 'firebase-functions'
import app from './src/app'

exports.choosabl = https.onRequest(app)
