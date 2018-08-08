export default async (req, res) => {
  const { battlesRef, profilesRef, votesRef } = res.locals
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const voteFor = +Boolean(+req.params.voteFor)
  const battleSnap = await battlesRef
    .where('id', '===', battleUID)
    .limit(1)
    .get()
  // battle exists
  if (!battleSnap.size) {
    return res.status(404).end()
  }
  // battle user is not the same user who is voting
  const battle = battleSnap.docs[0].data()
  if (battle.user === userUID) {
    return res.status(500).end('Not allowed to vote for yourself.')
  }
  // battle user has enough votes for other users to vote on one of his battles
  const battleUser = (await profilesRef.doc(battle.user).get()).data()
  if (!battleUser.votes) {
    return res
      .status(500)
      .end('Not allowed to vote for this user with not enough votes.')
  }
  // voting user has not already vote for this battle
  const userVotesSnap = await votesRef
    .where('battle', '==', battleUID)
    .where('user', '==', userUID)
    .limit(1)
    .get()
  if (userVotesSnap.size) {
    return res.status(500).end('Not allowed to vote again on this battle.')
  }
  const currentProfile = (await profilesRef.doc(userUID).get()).data()
  const now = new Date().getTime()
  await Promise.all([
    profilesRef.doc(userUID).update({
      votes: (currentProfile.votes || 0) + 1,
      updatedAt: now
    }),
    votesRef.doc().add({
      user: userUID,
      battle: battleUID,
      voteFor,
      createdAt: now
    })
  ])
  res.end()
}
