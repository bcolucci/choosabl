const { battlesRef } = require('../utils/db')

module.exports = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const snap = await battlesRef.doc(battleUID).get()
  if (!snap.exists) {
    res.status(404)
    return next(new Error('Not found.'))
  }
  const battle = snap.data()
  if (battle.user !== userUID) {
    res.status(500)
    return next(new Error('Not allowed.'))
  }
  res.locals.battle = battle
  next()
}
