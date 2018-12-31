const errors = require('../errors')
const repository = require('./repository')

const get = (req, res, next) =>
  repository
    .findByBattle(req.params.battleUID)
    .then(votes => res.json(votes))
    .catch(err => next(err))

const create = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const voteFor = +Boolean(+req.params.voteFor)
  try {
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
  } catch (err) {
    next(err)
  }
}

module.exports = {
  get,
  create
}
