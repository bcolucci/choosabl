const { votesRef, profilesRef } = require('../utils/db')

const defaultStats = () => ({
  total: 0,
  unknown: 0,
  man: 0,
  woman: 0,
  photo1: {
    total: 0,
    unknown: 0,
    man: 0,
    woman: 0
  },
  photo2: {
    total: 0,
    unknown: 0,
    man: 0,
    woman: 0
  }
})

const defGender = gender => gender || 'unknown'

const byGendersStatsProto = () => ({ unknown: 0, man: 0, woman: 0 })

const createPhotoStatsBuilder = votes => num => {
  const photoVotes = votes.filter(({ voteFor }) => voteFor === num)
  return {
    total: photoVotes.length,
    ...photoVotes.reduce((acc, vote) => {
      const gender = defGender(vote.user.gender)
      return {
        ...acc,
        [gender]: acc[gender] + 1
      }
    }, byGendersStatsProto())
  }
}

module.exports = async (req, res) => {
  const { battle } = res.locals
  const stats = defaultStats()
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
  Object.assign(stats, {
    publishedAt: battle.publishedAt,
    total: votes.length,
    ...byGendersStatsProto()
  })
  votes.forEach(vote => {
    vote.user = users.find(user => user.id === vote.user)
    stats[defGender(vote.user.gender)] += 1
  })
  const buildPhotoStats = createPhotoStatsBuilder(votes)
  Object.assign(stats, {
    photo1: buildPhotoStats(0),
    photo2: buildPhotoStats(1)
  })
  res.json(stats)
}
