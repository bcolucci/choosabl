const ejs = require('ejs')

module.exports = async ({ referrer, email, message }) => {
  const invitationLink = `${process.env.CLIENT_URL}/?referrer=${referrer.uid}`
  const html = await ejs.renderFile(__dirname + '/invitation.ejs', {
    referrer,
    message,
    invitationLink
  })
  return {
    from: '"Choosabl.com" <no-reply@choosabl.com>',
    subject: 'Choosabl - Invitation',
    to: email,
    html
  }
}
