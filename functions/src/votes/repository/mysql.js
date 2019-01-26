const errors = require('../../errors')
const DB = require('../../utils/mysql')

const didUserAlreadyVoteForBattle = ({ userUID, battleUID }) =>
  DB.queryFirstScalar(
    'SELECT COUNT(*) FROM votes WHERE user = ? AND battle = ? LIMIT 1',
    [userUID, battleUID]
  ).then(res => res > 0)

const create = async ({ userUID, battleUID, voteFor }) => {
  const battle = await DB.queryFirst('SELECT * FROM battles WHERE id = ?', [
    battleUID
  ])
  if (!battle) {
    return errors.NotFound
  }
  if (battle.user === userUID) {
    return errors.NotAllowedToVoteForYourself
  }
  // battle user has enough votes for other users to vote on one of his battles
  const battleUser = await DB.queryFirst(
    'SELECT * FROM profiles WHERE id = ?',
    [battle.user]
  )
  if (battleUser.votes === null) {
    battleUser.votes = 3
    await DB.update('profiles', { votes: 3 }, { id: battle.user })
  } else if (battleUser.votes === 0) {
    return errors.UserHasNotEnoughVotes
  }
  // voting user has not already vote for this battle
  const alreadyVote = await didUserAlreadyVoteForBattle({ userUID, battleUID })
  if (alreadyVote) {
    return errors.NotAllowedToVoteTwice
  }
  const currentProfile = await DB.queryFirst(
    'SELECT * FROM profiles WHERE id = ?',
    [userUID]
  )
  const now = new Date()
  const vote = {
    user: userUID,
    battle: battleUID,
    voteFor,
    createdAt: now
  }
  const createVote = DB.insert('votes', vote)
  const updateBattleUserProfile = DB.update(
    'profiles',
    { votes: battleUser.votes - 1, updatedAt: now },
    { id: battleUser.id }
  )
  const updateVoterProfile = DB.update(
    'profiles',
    {
      votes: (currentProfile.votes || 0) + 1,
      updatedAt: now
    },
    { id: currentProfile.id }
  )
  await Promise.all([createVote, updateBattleUserProfile, updateVoterProfile])
  return vote
}

const findByBattle = battleUID =>
  DB.query('SELECT * FROM votes WHERE battle = ?', [battleUID])

module.exports = {
  create,
  findByBattle
}
