require('./init')
const { https } = require('firebase-functions')
const { app } = require('./_app')

require('./collections').forEach(col => require(`./${col}`))

module.exports.v1 = https.onRequest(app)
