require('./init')
const { https } = require('firebase-functions')
const { app } = require('./src/_app')

require('./src/battles')
require('./src/invitations')
require('./src/profiles')
require('./src/votes')

module.exports.v1 = https.onRequest(app)
