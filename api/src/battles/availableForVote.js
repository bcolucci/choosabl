export default async (req, res) => {
  const { battlesRef, profilesRef } = res.locals
  const userUID = req.header('UserUID')
  const users = {}
  const battles = []
  const battlesIt = await battlesRef
    .where('active', '==', true)
    .orderBy('updatedAt', 'desc')
    .limit(50)
    .get()
  // const bucket = storage().bucket()
  const resolved = Promise.resolve()
  await Promise.all(
    battlesIt.docs.map(async battleSnap => {
      const battle = battleSnap.data()
      if (battle.user === userUID) {
        return resolved
      }
      if (!users[battle.user]) {
        const battleUser = (await profilesRef.doc(battle.user).get()).data()
        users[battle.user] = battleUser
      }
      if (users[battle.user].votes === undefined) {
        users[battle.user].votes = 3
      }
      if (!users[battle.user].votes) {
        return resolved
      }
      users[battle.user].votes -= 1
      // const [buffer1, buffer2] = await Promise.all([
      //   bucket.file(battle.photo1Path).download(),
      //   bucket.file(battle.photo2Path).download()
      // ])
      battles.push({
        ...battle
        // photo1: buffer1[0].toString('base64'),
        // photo2: buffer2[0].toString('base64')
      })
      return resolved
    })
  )
  res.json(battles)
}
