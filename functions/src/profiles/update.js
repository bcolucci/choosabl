const { profilesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const { profile } = req.body
  const now = new Date().getTime()
  await profilesRef.doc(userUID).update({ ...profile, updatedAt: now })
  res.end()
}
