const createProfile = require('./_createProfile')

module.exports = async (req, res) => {
  const { profilesRef } = res.locals
  const userUID = req.header('UserUID')
  const { referrer } = req.query
  const { email } = req.body
  const profileSnap = await profilesRef.doc(userUID).get()
  if (!profileSnap.exists) {
    await profilesRef.doc(userUID).set(createProfile({ email, referrer }))
  }
  res.end()
}
