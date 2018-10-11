const { votesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { battle } = res.locals
  const iterator = await votesRef.where('battle', '==', battle.id).get()
  // TODO
  iterator.forEach(snap => console.log(snap.data()))
  res.json({ OK: 42 })
}
