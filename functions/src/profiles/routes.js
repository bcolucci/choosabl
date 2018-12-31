const fetch = require('node-fetch')
const qs = require('querystring')
const uuid = require('uuid/v4')
const { auth } = require('firebase-admin')
const repository = require('./repository')

const get = (req, res, next) =>
  repository
    .findById(req.header('UserUID'))
    .then(profile => res.json(profile || {}))
    .catch(err => next(err))

const create = (req, res, next) => {
  const userUID = req.header('UserUID')
  const { referrer } = req.query
  const { email } = req.body
  repository
    .createIfNotExists({ userUID, email, referrer })
    .then(profile => res.json(profile))
    .catch(err => next(err))
}

const update = (req, res, next) => {
  const userUID = req.header('UserUID')
  const { profile } = req.body
  repository
    .update({ userUID, profile })
    .then(() => res.end())
    .catch(err => next(err))
}

const stats = (req, res, next) => {
  const userUID = req.header('UserUID')
  repository
    .stats(userUID)
    .then(stats => res.json(stats))
    .catch(err => next(err))
}

// --- linkedin ---------------------------------------------------------------

// TODO move out
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
  const profile = await repository.findByEmail(email)
  const uid = profile ? profile.id : uuid()
  if (!profile) {
    try {
      await auth().createUser({
        uid,
        email,
        emailVerified: true
      })
      await repository.create({ userUID: uid, email, referrer })
    } catch (err) {
      return res.redirect(
        `${redirectURI}?${qs.stringify({ state: crsf, error: err.message })}`
      )
    }
  }
  const token = await auth().createCustomToken(uid)
  res.redirect(`${redirectURI}?${qs.stringify({ state: crsf, token })}`)
}

const linkedinAuth = (req, res) => {
  const { crsf, code, referrer } = req.query
  if (!code) {
    return askForCode({ crsf, res })
  }
  if (crsf && code) {
    return askForToken({ crsf, code, referrer, res })
  }
  res.status(500).end()
}

module.exports = {
  get,
  create,
  update,
  stats,
  linkedinAuth
}
