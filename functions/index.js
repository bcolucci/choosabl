require('./init')
const { https } = require('firebase-functions')
const { app } = require('./src/_app')

require('./src/collections').forEach(col => require(`./src/${col}`))

module.exports.v1 = https.onRequest(app)
