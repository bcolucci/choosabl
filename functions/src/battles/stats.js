const { votesRef, profilesRef } = require('../utils/db')

const byGendersStatsProto = () => ({ '': 0, man: 0, woman: 0 })

const createPhotoStatsBuilder = votes => num => {
  const photoVotes = votes.filter(({ voteFor }) => voteFor === num)
  return {
    votes: photoVotes.length,
    byGenders: photoVotes.reduce(
      (acc, vote) => ({
        ...acc,
        [vote.user.gender]: acc[vote.user.gender] + 1
      }),
      byGendersStatsProto()
    )
  }
}

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
  stats.byGenders = byGendersStatsProto()
  votes.forEach(vote => {
    vote.user = users.find(user => user.id === vote.user)
    stats.byGenders[vote.user.gender] += 1
  })
  const buildPhotoStats = createPhotoStatsBuilder(votes)
  stats.byPhotos = [buildPhotoStats(0), buildPhotoStats(1)]
  res.json(stats)
}
