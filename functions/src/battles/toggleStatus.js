const { battlesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { battleUID } = req.params
  const { battle } = res.locals
  const now = new Date().getTime()
  await battlesRef
    .doc(battleUID)
    .update({ active: !battle.active, updatedAt: now })
  res.end()
}
