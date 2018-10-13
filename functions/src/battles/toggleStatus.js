const { battlesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { battleUID } = req.params
  const { battle } = res.locals
  const now = new Date().getTime()
  const active = !battle.active
  const updates = { active, updatedAt: now }
  if (!battle.publishedAt && active) {
    updates.publishedAt = now
  }
  await battlesRef.doc(battleUID).update(updates)
  res.end()
}
