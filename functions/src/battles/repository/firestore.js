const uuid = require('uuid/v4')
const errors = require('../../errors')
const { detectBattleFaces } = require('../../utils/vision')
const DB = require('../../utils/db')

const create = async ({ userUID, battle }) => {
  const id = uuid()
  const now = new Date().getTime()
  const doc = {
    ...battle,
    id,
    user: userUID,
    active: false,
    publishedAt: null,
    createdAt: now,
    updatedAt: now
  }
  await detectBattleFaces({ battle, persist: true })
  await Promise.all([DB.battlesRef.doc(id).set(doc)])
  await populatePhotos(doc)
  return doc
}

const remove = async battleUID =>
  await Promise.all([
    DB.battlesRef.doc(battleUID).delete(),
    DB.votesRef
      .where('battle', '==', battleUID)
      .get()
      .then(votesSnap => {
        const batch = DB.batch()
        votesSnap.forEach(snap => batch.delete(snap.ref))
        return batch.commit()
      })
  ])

const toggleStatus = async battle => {
  const now = new Date().getTime()
  const active = !battle.active
  const updates = { active, updatedAt: now }
  if (!battle.publishedAt && active) {
    updates.publishedAt = now
  }
  await DB.battlesRef.doc(battle.id).update(updates)
}

const findById = async battleUID => {
  const battle = await DB.battlesRef.doc(battleUID).get()
  if (!battle.exists) {
    return errors.NotFound
  }
  return battle.data()
}

const findByUser = async userUID => {
  const battles = []
  const iterator = await DB.battlesRef
    .where('user', '==', userUID)
    .orderBy('updatedAt', 'desc')
    .get()
  iterator.forEach(snap => battles.push(snap.data()))
  await Promise.all(battles.map(populatePhotos))
  return battles
}

const availableForVote = async userUID => {
  const users = {}
  const battles = []
  const battlesIt = await DB.battlesRef
    .where('active', '==', true)
    .orderBy('updatedAt', 'desc')
    .get()
  const resolved = Promise.resolve()
  await Promise.all(
    battlesIt.docs.map(async battleSnap => {
      const battle = battleSnap.data()
      if (battle.user === userUID) {
        return resolved
      }
      const voteForThisBattle = await DB.votesRef
        .where('user', '==', userUID)
        .where('battle', '==', battle.id)
        .limit(1)
        .get()
      if (voteForThisBattle.size) {
        return resolved
      }
      if (!users[battle.user]) {
        const battleUser = (await DB.profilesRef.doc(battle.user).get()).data()
        users[battle.user] = battleUser
      }
      if (users[battle.user].votes === undefined) {
        users[battle.user].votes = 3
      }
      if (!users[battle.user].votes) {
        return resolved
      }
      users[battle.user].votes -= 1
      battles.push(battle)
      return resolved
    })
  )
  await Promise.all(battles.map(populatePhotos))
  return battles
}

const populatePhotos = async battle => {
  ;(await Promise.all(
    ['photo1', 'photo2'].map(field =>
      DB.photosRef
        .where('id', '==', battle[field])
        .limit(1)
        .get()
    )
  ))
    .map(rows => rows.docs.shift())
    .forEach((snap, idx) => {
      Object.assign(battle, {
        [`photo${idx + 1}`]: snap.exists
          ? snap.data()
          : {
            path: 'image-not-found.gif',
            type: 'image/gif'
          }
      })
    })
}

// --- stats ------------------------------------------------------------------

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

const stats = async battle => {
  const stats = defaultStats()
  const iterator = await DB.votesRef.where('battle', '==', battle.id).get()
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
      DB.profilesRef
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
  return stats
}

module.exports = {
  create,
  remove,
  toggleStatus,
  findById,
  findByUser,
  availableForVote,
  populatePhotos,
  stats
}
