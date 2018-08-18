const fetch = require('node-fetch')
const qs = require('querystring')
const { auth } = require('firebase-admin')
const { collections } = require('../utils/db')
const createProfile = require('./_createProfile')

const clientID = '86wddsl6iks71w'
const clientSecret = 'O7NgQ0PbLUFYEYTF'

const redirectURI = `${process.env.CLIENT_URL}?linkedin_callback=1`

const askForCode = ({ crsf, res }) => {
  const params = {
    state: crsf,
    response_type: 'code',
    client_id: clientID,
    redirect_uri: redirectURI,
    scope: 'r_emailaddress'
  }
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${qs.stringify(params)}`
  )
}

const askForToken = async ({ crsf, code, referrer, res }) => {
  const params = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectURI,
    client_id: clientID,
    client_secret: clientSecret
  }
  const lkres = await fetch(
    `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(params)}`,
    { method: 'POST' }
  )
  const { error, access_token } = await lkres.json()
  if (error) {
    return res.redirect(
      `${redirectURI}?${qs.stringify({ state: crsf, error })}`
    )
  }
  const email = await (async () => {
    const res = await fetch(
      `https://api.linkedin.com/v1/people/~:(email-address)`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'x-li-format': 'json'
        }
      }
    )
    const { emailAddress } = await res.json()
    return emailAddress
  })()
  const { profilesRef } = collections
  const profileSnap = await profilesRef
    .where('email', '==', email)
    .limit(1)
    .get()
  let uid = null
  if (profileSnap.size) {
    uid = profileSnap.docs[0].id
  } else {
    const { profilesRef } = collections
    const doc = profilesRef.doc()
    uid = doc.id
    try {
      await auth().createUser({
        uid,
        email,
        emailVerified: true
      })
      await profilesRef.doc(uid).set(createProfile({ email, referrer }))
    } catch (err) {
      return res.redirect(
        `${redirectURI}?${qs.stringify({ state: crsf, error: err.message })}`
      )
    }
  }
  const token = await auth().createCustomToken(uid)
  res.redirect(`${redirectURI}?${qs.stringify({ state: crsf, token })}`)
}

module.exports = (req, res) => {
  const { crsf, code, referrer } = req.query
  if (!code) {
    return askForCode({ crsf, res })
  }
  if (crsf && code) {
    return askForToken({ crsf, code, referrer, res })
  }
  res.status(500).end()
}
