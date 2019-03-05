const uuid = require('uuid/v4')
const errors = require('../errors')
const { detectBattleFaces } = require('../utils/vision')
const DB = require('../utils/mysql')

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
  await DB.insert('battles', doc)
  await populatePhotos([doc])
  return doc
}

const remove = battleUID =>
  Promise.all([
    DB.delete('battles', { id: battleUID }),
    DB.delete('votes', { battle: battleUID })
  ])

const toggleStatus = async battle => {
  const now = new Date()
  const active = !battle.active
  const updates = { active, updatedAt: now }
  if (!battle.publishedAt && active) {
    updates.publishedAt = now
  }
  return DB.update('battles', updates, { id: battle.id })
}

const findById = async battleUID => {
  const battle = await DB.queryFirst('SELECT * FROM battles WHERE id = ?', [
    battleUID
  ])
  if (!battle) {
    return errors.NotFound
  }
  return battle
}

const findByUser = async userUID => {
  const battles = await DB.query(
    'SELECT * FROM battles WHERE user = ? ORDER BY updatedAt DESC',
    [userUID]
  )
  await populatePhotos(battles)
  return battles
}

const availableForVote = async userUID => {
  const battles = await DB.query(
    `
      SELECT b.*
      FROM battles AS b
      JOIN profiles AS p ON p.id = b.user
      WHERE
        b.active IS TRUE
        AND b.user != ?
        AND p.votes > 0
        AND b.id NOT IN (
          SELECT v.battle
          FROM votes AS v
          WHERE v.battle = b.id AND v.user = ?
        )
      ORDER BY updatedAt DESC
  `,
    [userUID, userUID]
  )
  await populatePhotos(battles)
  return battles
}

const populatePhotos = async battles => {
  const photoUIDs = battles
    .reduce((acc, { photo1, photo2 }) => [...acc, photo1, photo2], [])
    .filter(global.unique)
  const photos = photoUIDs.length
    ? await DB.query('SELECT * FROM photos WHERE id IN (?)', [photoUIDs])
    : []
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
  const votes = await DB.query('SELECT * FROM votes WHERE battle = ?', [
    battle.id
  ])
  const userUIDs = votes.map(({ user }) => user).filter(global.unique)
  const users = userUIDs.length
    ? await DB.query('SELECT * FROM profiles WHERE id IN (?)', [userUIDs])
    : []
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
