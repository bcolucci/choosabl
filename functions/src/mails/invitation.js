const { CLIENT_URL } = process.env

module.exports = ({ referrer, email }) => {
  const invitationLink = `${CLIENT_URL}/?referrer=${referrer.uid}`
  return {
    to: email,
    from: '"Choosabl.com" <no-reply@choosabl.com>',
    subject: 'Choosabl - Invitation',
    html: `
      <p>
        <strong>Choosabl.com</strong>
        <br/>
        Invitation
      </p>
      <hr/>
      <p>Hi!</p>
      <p>You have been invited to join Choosabl community by: <em>${referrer.displayName ||
        referrer.email}</em></p>
      <p>
        Please click on the link to register:
        <br/>
        <a href="${invitationLink}">${invitationLink}</a>
      </p>
      `
  }
}
