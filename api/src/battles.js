import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import firebase, { storage } from 'firebase-admin'
import { createFirebaseAuth } from 'express-firebase-auth'
import sharp from 'sharp'
import uuid from 'uuid/v4'
import db from './utils/db'
import idreg from './utils/idreg'

const profilesRef = db.collection('profiles')
const battlesRef = db.collection('battles')
const votesRef = db.collection('votes')

const app = express()
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(createFirebaseAuth({ firebase }))

const isUserBattleHandler = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const snap = await battlesRef.doc(battleUID).get()
  if (!snap.exists || snap.data().user !== userUID) {
    res.status(500)
    return next(new Error('Not allowed.'))
  }
  res.locals.battle = snap.data()
  next()
}

app.get(`/${idreg('battleUID')}?`, async (req, res) => {
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  if (battleUID) {
    const battle = await battlesRef.doc(battleUID).get()
    if (!battle.exists) {
      return res.status(500).end('Not found.')
    }
    if (battle.user !== userUID) {
      return res.status(500).end('Not allowed.')
    }
    return res.json(battle)
  }
  const battles = []
  const iterator = await battlesRef
    .where('user', '==', userUID)
    .orderBy('updatedAt', 'desc')
    .get()
  iterator.forEach(snap => battles.push(snap.data()))
  res.json(battles)
})

app.get('/availableForVote', async (req, res) => {
  const userUID = req.header('UserUID')
  const users = {}
  const battles = []
  const battlesIt = await battlesRef
    .where('active', '==', true)
    .orderBy('updatedAt', 'desc')
    .limit(50)
    .get()
  // const bucket = storage().bucket()
  const resolved = Promise.resolve()
  await Promise.all(
    battlesIt.docs.map(async battleSnap => {
      const battle = battleSnap.data()
      if (battle.user === userUID) {
        return resolved
      }
      if (!users[battle.user]) {
        const battleUser = (await profilesRef.doc(battle.user).get()).data()
        users[battle.user] = battleUser
      }
      if (users[battle.user].votes === undefined) {
        users[battle.user].votes = 3
      }
      if (!users[battle.user].votes) {
        return resolved
      }
      users[battle.user].votes -= 1
      // const [buffer1, buffer2] = await Promise.all([
      //   bucket.file(battle.photo1Path).download(),
      //   bucket.file(battle.photo2Path).download()
      // ])
      battles.push({
        ...battle
        // photo1: buffer1[0].toString('base64'),
        // photo2: buffer2[0].toString('base64')
      })
      return resolved
    })
  )
  res.json(battles)
})

const cropToExtract = ({ x, y, width, height }) => ({
  left: Math.floor(x),
  top: Math.floor(y),
  width: Math.floor(width),
  height: Math.floor(height)
})

const resizePhoto = async (path, crop) => {
  const bucket = storage().bucket()
  const [buffer] = await bucket.file(path).download()
  const resized = await sharp(buffer)
    .resize(200)
    .extract(cropToExtract(crop))
    .toBuffer()
  await bucket.file(path).save(resized.toString('base64'))
}

app.post('/', async (req, res) => {
  const userUID = req.header('UserUID')
  const id = uuid()
  const { battle, crops } = req.body
  const now = new Date().getTime()
  await Promise.all([
    resizePhoto(battle.photo1Path, crops.crop1),
    resizePhoto(battle.photo2Path, crops.crop2),
    battlesRef.doc(id).set({
      ...battle,
      id,
      user: userUID,
      active: false,
      createdAt: now,
      updatedAt: now
    })
  ])
  res.end()
})

app.put(
  `/${idreg('battleUID')}/toggleStatus`,
  isUserBattleHandler,
  async (req, res) => {
    const { battleUID } = req.params
    const { battle } = res.locals
    const now = new Date().getTime()
    await battlesRef
      .doc(battleUID)
      .update({ active: !battle.active, updatedAt: now })
    res.end()
  }
)

app.delete(`/${idreg('battleUID')}`, isUserBattleHandler, async (req, res) => {
  const { battleUID } = req.params
  const { battle } = res.locals
  const bucket = storage().bucket()
  await Promise.all([
    battlesRef.doc(battleUID).delete(),
    bucket.file(battle.photo1Path).delete(),
    bucket.file(battle.photo2Path).delete(),
    votesRef.where('battle', '==', battleUID).get().then(votesSnap => {
      const batch = db.batch()
      votesSnap.forEach(snap => batch.delete(snap.ref))
      return batch.commit()
    })
  ])
  res.end()
})

export default app
