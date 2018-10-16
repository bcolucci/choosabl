const { profilesRef, battlesRef, votesRef } = require('../utils/db')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const profile = await profilesRef.doc(userUID).get()
  const battles = []
  const battlesIterator = await battlesRef.where('user', '==', userUID).get()
  battlesIterator.forEach(snap => battles.push(snap.data()))
  const votesIterators = await Promise.all(
    battles.map(({ id }) => votesRef.where('battle', '==', id).get())
  )
  return res.json({
    battles: {
      total: battles.length,
      actives: battles.filter(({ active }) => active).length,
      draft: battles.filter(({ active }) => !active).length
    },
    votes: {
      remaining: profile.votes,
      given: (await votesRef.where('user', '==', userUID).get()).size,
      received: votesIterators.reduce((acc, res) => acc + res.size, 0)
    }
  })
}
