const { createProfile } = require('../utils')
const DB = require('../../utils/spanner')

const createIfNotExists = ({ userUID, email, referrer }) =>
  findById(userUID).then(
    profile =>
      profile
        ? Promise.resolve()
        : create(createProfile({ uuid: userUID, email, referrer }))
  )

const create = profile =>
  DB.table('profiles')
    .insert([profile])
    .then(() => profile)

const findById = id =>
  DB.run({
    sql: 'SELECT * FROM profiles WHERE id = @id',
    params: { id },
    json: true
  }).then(first)

const findByEmail = email =>
  DB.run({
    sql: 'SELECT id FROM profiles WHERE email = @email',
    params: {
      email
    },
    json: true
  }).then(first)

const update = ({ userUID, profile }) => {
  const now = new Date()
  return DB.table('profiles').update({
    ...profile,
    id: userUID,
    updatedAt: now
  })
}

const stats = async userUID => {
  const profile = await DB.run({
    sql: 'SELECT * FROM profiles WHERE id = @userUID',
    params: { userUID },
    json: true
  }).then(first)
  const battles = await DB.run({
    sql: 'SELECT * FROM battles WHERE user = @userUID',
    params: { userUID },
    json: true
  }).then(all)
  const nbGivenVotes = await DB.run({
    sql: 'SELECT user FROM votes WHERE user = @userUID',
    params: { userUID }
  }).then(([rows]) => rows.length)
  const nbReceivedVotes = await DB.run({
    sql:
      'SELECT v.* FROM votes AS v WHERE v.battle IN (SELECT b.id FROM battles AS b WHERE b.user = @userUID)',
    params: { userUID }
  }).then(([rows]) => rows.length)
  return {
    battles: {
      total: battles.length,
      actives: battles.filter(({ active }) => active).length,
      draft: battles.filter(({ active }) => !active).length
    },
    votes: {
      remaining: profile.votes,
      given: nbGivenVotes,
      received: nbReceivedVotes
    }
  }
}

module.exports = {
  createIfNotExists,
  create,
  findById,
  findByEmail,
  update,
  stats
}
