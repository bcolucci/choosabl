import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import db from './utils/db'
import idreg from './utils/idreg'

const battlesRef = db.collection('battles')
const votesRef = db.collection('votes')

const app = express()
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))

app.get(`/${idreg('battleUID')}`, async (req, res) => {
  const { battleUID } = req.params
  const votes = []
  const iterator = await votesRef.where('battle', '==', battleUID).get()
  iterator.forEach(snap => votes.push(snap.data()))
  res.json(votes)
})

app.post(`/${idreg('battleUID')}/:voteFor(0|1)`, async (req, res) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const voteFor = +Boolean(+req.params.voteFor)
  const battleSnap = await battlesRef
    .where('id', '===', battleUID)
    .limit(1)
    .get()
  // battle exists
  if (!battleSnap.size) {
    return res.status(404).end()
  }
  // battle user is not the same user who is voting
  const battle = battleSnap.docs[0].data()
  if (battle.user === userUID) {
    return res.status(500).end('Not allowed to vote for yourself.')
  }
  // battle user has enough votes for other users to vote on one of his battles
  const battleUser = (await profilesRef.doc(battle.user).get()).data()
  if (!battleUser.votes) {
    return res
      .status(500)
      .end('Not allowed to vote for this user with not enough votes.')
  }
  // voting user has not already vote for this battle
  const userVotesSnap = await votesRef
    .where('battle', '==', battleUID)
    .where('user', '==', userUID)
    .limit(1)
    .get()
  if (userVotesSnap.size) {
    return res.status(500).end('Not allowed to vote again on this battle.')
  }
  const currentProfile = (await profilesRef.doc(userUID).get()).data()
  const now = new Date().getTime()
  await Promise.all([
    profilesRef.doc(userUID).update({
      votes: (currentProfile.votes || 0) + 1,
      updatedAt: now
    }),
    votesRef.doc().add({
      user: userUID,
      battle: battleUID,
      voteFor,
      createdAt: now
    })
  ])
  res.end()
})

export default app
