const errors = require('../errors')
const repository = require('./repository')

const isUserBattle = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const battle = await repository.findById(battleUID)
  if (battle === errors.NotFound) {
    res.status(404)
    return next(battle)
  }
  if (battle.user !== userUID) {
    res.status(500)
    return next(errors.AccessDenied)
  }
  res.locals.battle = battle
  next()
}

module.exports = {
  isUserBattle
}
