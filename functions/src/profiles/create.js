const createProfile = require('./_createProfile')
const { profilesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const { referrer } = req.query
  const { email } = req.body
  const profileSnap = await profilesRef.doc(userUID).get()
  if (!profileSnap.exists) {
    await profilesRef
      .doc(userUID)
      .set(createProfile({ uuid: userUID, email, referrer }))
  }
  res.end()
}
