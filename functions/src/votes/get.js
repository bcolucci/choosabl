const { votesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { battleUID } = req.params
  const votes = []
  const iterator = await votesRef.where('battle', '==', battleUID).get()
  iterator.forEach(snap => votes.push(snap.data()))
  res.json(votes)
}
