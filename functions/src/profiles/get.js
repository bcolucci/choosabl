module.exports = async (req, res) => {
  const { profilesRef } = res.locals
  const userUID = req.header('UserUID')
  const profile = await profilesRef.doc(userUID).get()
  res.json((profile.exists && profile.data()) || {})
}
