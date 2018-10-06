const { profilesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const profile = await profilesRef.doc(userUID).get()
  res.json((profile.exists && profile.data()) || {})
}
