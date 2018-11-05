const errors = require('../errors')
const repository = require('./repository')

const availableForVote = async (req, res) => {
  const userUID = req.header('UserUID')
  const battles = await repository.availableForVote(userUID)
  res.json(battles)
}

const create = async (req, res) => {
  const userUID = req.header('UserUID')
  const { battle } = req.body
  const doc = await repository.create({ userUID, battle })
  res.json(doc)
}

const get = async (req, res) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
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
}

const remove = async (req, res) => {
  const { battleUID } = req.params
  try {
    await repository.remove(battleUID)
  } catch (err) {}
  res.end()
}

const stats = async (req, res) => {
  const { battle } = res.locals
  const stats = await repository.stats(battle)
  res.json(stats)
}

const toggleStatus = async (req, res) => {
  const { battle } = res.locals
  await repository.toggleStatus(battle)
  res.end()
}

module.exports = {
  availableForVote,
  create,
  get,
  remove,
  stats,
  toggleStatus
}
