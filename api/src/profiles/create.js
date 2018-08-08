import sillyname from 'sillyname'

export default async (req, res) => {
  const { profilesRef } = res.locals
  const userUID = req.header('UserUID')
  const profileSnap = await profilesRef.doc(userUID).get()
  if (!profileSnap.exists) {
    const now = new Date().getTime()
    const username = `${sillyname()} ${Math.ceil(Math.random() * 99)}`
    await profilesRef.doc(userUID).set({
      username,
      birthday: null,
      gender: '',
      votes: 3,
      createdAt: now,
      updatedAt: now
    })
  }
  res.end()
}
