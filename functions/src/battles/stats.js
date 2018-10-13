const { votesRef, profilesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const { battle } = res.locals
  const stats = {}
  const iterator = await votesRef.where('battle', '==', battle.id).get()
  const votes = []
  const userIds = []
  iterator.forEach(snap => {
    const vote = snap.data()
    votes.push(vote)
    if (!userIds.includes(vote.user)) {
      userIds.push(vote.user)
    }
  })
  const users = await Promise.all(
    userIds.map(id =>
      profilesRef
        .doc(id)
        .get()
        .then(snap => snap.data())
    )
  )
  stats.votes = votes.length
  stats.publishedAt = battle.publishedAt
  stats.byGenders = { '': 0, man: 0, woman: 0 }
  votes.forEach(vote => {
    const user = users.find(user => user.id === vote.user)
    stats.byGenders[user.gender] += 1
  })
  res.json(stats)
}
