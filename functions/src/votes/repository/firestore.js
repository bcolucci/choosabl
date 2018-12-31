const uuid = require('uuid/v4')
const errors = require('../../errors')
const DB = require('../../utils/db')

const create = async ({ userUID, battleUID, voteFor }) => {
  const battleSnap = await DB.battlesRef
    .where('id', '==', battleUID)
    .limit(1)
    .get()
  if (!battleSnap.size) {
    return errors.NotFound
  }
  const battle = battleSnap.docs[0].data()
  if (battle.user === userUID) {
    return errors.NotAllowedToVoteForYourself
  }
  // battle user has enough votes for other users to vote on one of his battles
  const battleUser = (await DB.profilesRef.doc(battle.user).get()).data()
  if (battleUser.votes === undefined) {
    await profilesRef.doc(battle.user).update({ votes: 3 })
    battleUser.votes = 3
  } else if (!battleUser.votes) {
    return errors.UserHasNotEnoughVotes
  }
  // voting user has not already vote for this battle
  const userVotesSnap = await DB.votesRef
    .where('battle', '==', battleUID)
    .where('user', '==', userUID)
    .limit(1)
    .get()
  if (userVotesSnap.size) {
    return errors.NotAllowedToVoteTwice
  }
  const currentProfile = (await DB.profilesRef.doc(userUID).get()).data()
  const now = new Date().getTime()
  const vote = {
    id: uuid(),
    user: userUID,
    battle: battleUID,
    voteFor,
    createdAt: now
  }
  await Promise.all([
    DB.votesRef.doc(vote.id).set(vote),
    DB.profilesRef.doc(battle.user).update({ votes: battleUser.votes - 1 }),
    DB.profilesRef.doc(userUID).update({
      votes: (currentProfile.votes || 0) + 1,
      updatedAt: now
    })
  ])
  return vote
}

const findByBattle = async battleUID => {
  const votes = []
  const iterator = await DB.votesRef.where('battle', '==', battleUID).get()
  iterator.forEach(snap => votes.push(snap.data()))
  return votes
}

module.exports = {
  create,
  findByBattle
}
