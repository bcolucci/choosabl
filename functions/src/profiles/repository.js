const createProfile = require('./createProfile')
const DB = require('../utils/mysql')

const createIfNotExists = async ({ userUID, email, referrer }) => {
  const exists = await findById(userUID)
  if (exists) {
    return
  }
  const profile = createProfile({ uuid: userUID, email, referrer })
  return await create(profile)
}

const create = async profile => {
  await DB.insert('profiles', profile)
  return profile
}

const findById = id =>
  DB.queryFirst('SELECT * FROM profiles WHERE id = ?', [id])

const findByEmail = email =>
  DB.queryFirst('SELECT id FROM profiles WHERE email = ?', [email])

const update = ({ userUID, profile }) => {
  const now = new Date()
  const updates = {
    ...profile,
    updatedAt: now
  }
  return DB.update('profiles', updates, { id: userUID })
}

const stats = async userUID => {
  const [
    profile,
    nbActiveBattles,
    nbInactiveBattles,
    nbGivenVotes,
    nbReceivedVotes
  ] = await Promise.all([
    findById(userUID),
    DB.queryFirstScalar(
      'SELECT COUNT(*) FROM battles WHERE user = ? AND active IS TRUE',
      [userUID]
    ),
    DB.queryFirstScalar(
      'SELECT COUNT(*) FROM battles WHERE user = ? AND active IS FALSE',
      [userUID]
    ),
    DB.queryFirstScalar('SELECT COUNT(*) FROM votes WHERE user = ?', [userUID]),
    DB.queryFirstScalar(
      `
        SELECT COUNT(*)
        FROM votes AS v
        WHERE 
          v.battle IN (SELECT b.id FROM battles AS b WHERE b.user = ?)
      `,
      [userUID]
    )
  ])
  return {
    battles: {
      total: nbActiveBattles + nbInactiveBattles,
      actives: nbActiveBattles,
      draft: nbInactiveBattles
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
