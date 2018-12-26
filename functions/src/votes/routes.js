const errors = require('../errors')
const repository = require('./repository')

const get = async (req, res) => {
  const { battleUID } = req.params
  const votes = await repository.findByBattle(battleUID)
  res.json(votes)
}

const create = async (req, res) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const voteFor = +Boolean(+req.params.voteFor)
  const vote = await repository.create({ userUID, battleUID, voteFor })
  if (vote === errors.NotFound) {
    return res.status(404).json(vote)
  }
  if (vote === errors.NotAllowedToVoteForYourself) {
    return res.status(500).json(vote)
  }
  if (vote === errors.UserHasNotEnoughVotes) {
    return resﬁ.status(500).json(vote)
  }
  if (vote === errors.NotAllowedToVoteTwice) {
    return res.status(500).json(vote)
  }
  res.json(vote)
}

module.exports = {
  get,
  create
}
