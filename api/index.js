import { https } from 'firebase-functions'
import hello from './src/hello'
import messages from './src/messages'
import secret from './src/secret'

exports.hello = https.onRequest(hello)
exports.messages = https.onRequest(messages)
exports.secret = https.onRequest(secret)
