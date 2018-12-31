const errors = require('../errors')
const repository = require('./repository')

const availableForVote = (req, res, next) => {
  const userUID = req.header('UserUID')
  repository
    .availableForVote(userUID)
    .then(battles => res.json(battles))
    .catch(err => next(err))
}

const create = (req, res, next) => {
  const userUID = req.header('UserUID')
  const { battle } = req.body
  repository
    .create({ userUID, battle })
    .then(doc => res.json(doc))
    .catch(err => next(err))
}

const get = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  try {
    if (battleUID) {
      const battle = await repository.findById(battleUID)
      if (battle === errors.NotFound) {
        res.status(404)
      }
      if (battle.user !== userUID) {
        res.status(500)
      }
      return res.json(battle)
    }
    const battles = await repository.findByUser(userUID)
    res.json(battles)
  } catch (err) {
    next(err)
  }
}

const remove = (req, res, next) => {
  const { battleUID } = req.params
  repository
    .remove(battleUID)
    .then(() => res.end())
    .catch(err => next(err))
}

const stats = (req, res, next) => {
  const { battle } = res.locals
  repository
    .stats(battle)
    .then(stats => res.json(stats))
    .catch(err => next(err))
}

const toggleStatus = (req, res, next) => {
  const { battle } = res.locals
  repository
    .toggleStatus(battle)
    .then(() => res.end())
    .catch(err => next(err))
}

module.exports = {
  availableForVote,
  create,
  get,
  remove,
  stats,
  toggleStatus
}
