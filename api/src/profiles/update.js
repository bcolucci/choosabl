export default async (req, res) => {
  const { profilesRef } = res.locals
  const userUID = req.header('UserUID')
  const { profile } = req.body
  const now = new Date().getTime()
  await profilesRef.doc(userUID).set({ ...profile, updatedAt: now })
  res.end()
}
