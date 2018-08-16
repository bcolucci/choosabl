const { createTransport } = require('nodemailer')

module.exports = createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  auth: {
    user: 'contact@choosabl.com',
    pass: 'contact@choosabl'
  }
})
