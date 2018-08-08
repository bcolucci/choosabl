export default async (req, res) => {
  const { profilesRef } = res.locals
  const userUID = req.header('UserUID')
  const { username, birthday, gender } = req.body
  const now = new Date().getTime()
  await profilesRef.doc(userUID).set({
    username,
    birthday,
    gender,
    updatedAt: now
  })
  res.end()
}
