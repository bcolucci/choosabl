const DB = require('../../utils/db')
const { createProfile } = require('../utils')

const silentCreate = async ({ userUID, email, referrer }) => {
  const profileSnap = await DB.profilesRef.doc(userUID).get()
  if (!profileSnap.exists) {
    await DB.profilesRef
      .doc(userUID)
      .set(createProfile({ uuid: userUID, email, referrer }))
  }
}

const createEmpty = () => DB.profilesRef.doc()

const create = async ({ userUID, profile }) =>
  await DB.profilesRef.doc(userUID).set(profile)

const findById = async userUID => {
  const profile = await DB.profilesRef.doc(userUID).get()
  return (profile.exists && profile.data()) || null
}

const findByEmail = async email => {
  const profile = await DB.profilesRef
    .where('email', '==', email)
    .limit(1)
    .get()
  return (profile.exists && profile.data()) || null
}

const update = async ({ userUID, profile }) => {
  const now = new Date().getTime()
  await DB.profilesRef.doc(userUID).update({ ...profile, updatedAt: now })
}

const stats = async userUID => {
  const profile = await DB.profilesRef.doc(userUID).get()
  const battles = []
  const battlesIterator = await DB.battlesRef.where('user', '==', userUID).get()
  battlesIterator.forEach(snap => battles.push(snap.data()))
  const votesIterators = await Promise.all(
    battles.map(({ id }) => DB.votesRef.where('battle', '==', id).get())
  )
  return {
    battles: {
      total: battles.length,
      actives: battles.filter(({ active }) => active).length,
      draft: battles.filter(({ active }) => !active).length
    },
    votes: {
      remaining: profile.votes,
      given: (await DB.votesRef.where('user', '==', userUID).get()).size,
      received: votesIterators.reduce((acc, res) => acc + res.size, 0)
    }
  }
}

module.exports = {
  silentCreate,
  createEmpty,
  create,
  findById,
  findByEmail,
  update,
  stats
}
