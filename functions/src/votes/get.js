module.exports = async (req, res) => {
  const { votesRef } = res.locals
  const { battleUID } = req.params
  const votes = []
  const iterator = await votesRef.where('battle', '==', battleUID).get()
  iterator.forEach(snap => votes.push(snap.data()))
  res.json(votes)
}
