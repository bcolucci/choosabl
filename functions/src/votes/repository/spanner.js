const errors = require('../../errors')
const DB = require('../../utils/spanner')

const didUserAlreadyVoteForBattle = ({ userUID, battleUID }) =>
  DB.run({
    sql: 'SELECT 1 FROM votes WHERE user = @userUID AND battle = @battleUID',
    params: { userUID, battleUID }
  }).then(([rows]) => rows.length > 0)

const create = async ({ userUID, battleUID, voteFor }) => {
  const battle = await battlesTable.findOne(battleUID)
  if (!battle) {
    return errors.NotFound
  }
  if (battle.user === userUID) {
    return errors.NotAllowedToVoteForYourself
  }
  // battle user has enough votes for other users to vote on one of his battles
  const battleUser = await profilesTable.findOne(battle.user)
  if (battleUser.votes === undefined) {
    battleUser.votes = 3
    await DB.table('profiles').update(battleUser)
  } else if (battleUser.votes === 0) {
    return errors.UserHasNotEnoughVotes
  }
  // voting user has not already vote for this battle
  const alreadyVote = await didUserAlreadyVoteForBattle({ userUID, battleUID })
  if (alreadyVote) {
    return errors.NotAllowedToVoteTwice
  }
  const currentProfile = await profilesTable.findOne(userUID)
  const now = new Date()
  const vote = {
    user: userUID,
    battle: battleUID,
    voteFor,
    createdAt: now
  }
  const createVote = DB.table('votes').insert([vote])
  const updateBattleUserProfile = DB.table('profiles').update({
    id: battleUser.id,
    votes: battleUser.votes - 1,
    updatedAt: now
  })
  const updateVoterProfile = DB.table('profiles').update({
    id: currentProfile.id,
    votes: (currentProfile.votes || 0) + 1,
    updatedAt: now
  })
  await Promise.all([createVote, updateBattleUserProfile, updateVoterProfile])
  return vote
}

const findByBattle = battleUID =>
  DB.run({
    sql: 'SELECT * FROM votes WHERE battle = @battleUID',
    params: { battleUID },
    json: true
  }).then(all)

module.exports = {
  create,
  findByBattle
}
