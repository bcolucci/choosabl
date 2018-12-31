const uuid = require('uuid/v4')
const errors = require('../../errors')
const { detectBattleFaces } = require('../../utils/vision')
const DB = require('../../utils/spanner')

const notFoundImg = {
  path: 'image-not-found.gif',
  type: 'image/gif'
}

const create = async ({ userUID, battle }) => {
  const now = new Date()
  const doc = {
    ...battle,
    id: uuid(),
    user: userUID,
    active: false,
    publishedAt: null,
    createdAt: now,
    updatedAt: now
  }
  await detectBattleFaces({ battle, persist: true })
  await DB.table('battles').insert([doc])
  await populatePhotos([doc])
  return doc
}

const remove = battleUID =>
  Promise.all([
    DB.table('battles').deleteRows([battleUID]),
    DB.run({
      sql: 'DELETE FROM votes WHERE battle = @battleUID',
      params: { battleUID }
    })
  ])

const toggleStatus = async battle => {
  const now = new Date()
  const active = !battle.active
  const updates = { active, updatedAt: now }
  if (!battle.publishedAt && active) {
    updates.publishedAt = now
  }
  return DB.table('battles').update({ id: battle.id, ...updates })
}

const findById = async battleUID => {
  const [rows] = await DB.run({
    sql: 'SELECT * FROM battles WHERE id = @battleUID',
    params: { battleUID },
    json: true
  })
  if (rows.length === 0) {
    return errors.NotFound
  }
  return rows[0]
}

const findByUser = async userUID => {
  const battles = await DB.run({
    sql: 'SELECT * FROM battles WHERE user = @userUID ORDER BY updatedAt DESC',
    params: { userUID },
    json: true
  }).then(all)
  await populatePhotos(battles)
  return battles
}

const availableForVote = async userUID => {
  const battles = await DB.run({
    sql: `
      SELECT b.*
      FROM battles AS b
      JOIN profiles AS p ON p.id = b.user
      WHERE
        b.active = TRUE
        AND b.user != @userUID
        AND p.votes > 0
        AND b.id NOT IN (SELECT v.battle FROM votes AS v WHERE v.battle = b.id AND v.user = @userUID)
      ORDER BY updatedAt DESC
  `,
    params: { userUID },
    json: true
  }).then(all)
  await populatePhotos(battles)
  return battles
}

const populatePhotos = async battles => {
  const photoUIDs = battles
    .reduce((acc, { photo1, photo2 }) => [...acc, photo1, photo2], [])
    .filter(unique)
  const photos = await DB.run({
    sql: 'SELECT * FROM photos WHERE id IN UNNEST (@photoUIDs)',
    params: { photoUIDs },
    types: {
      photoUIDs: {
        type: 'array',
        child: 'string'
      }
    },
    json: true
  }).then(all)
  const findPhoto = id =>
    photos.find(photo => photo.id === id) || { ...notFoundImg }
  battles.forEach(battle => {
    battle.photo1 = findPhoto(battle.photo1)
    battle.photo2 = findPhoto(battle.photo2)
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
  const votes = await DB.run({
    sql: 'SELECT * FROM votes WHERE battle = @id',
    params: { id: battle.id },
    json: true
  }).then(all)
  const userUIDs = votes.map(({ user }) => user).filter(unique)
  const users = await DB.run({
    sql: 'SELECT * FROM profiles WHERE id IN UNNEST (@userUIDs)',
    params: { userUIDs },
    types: {
      userUIDs: {
        type: 'array',
        child: 'string'
      }
    },
    json: true
  }).then(all)
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
  stats.photo1 = buildPhotoStats(0)
  stats.photo2 = buildPhotoStats(1)
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
