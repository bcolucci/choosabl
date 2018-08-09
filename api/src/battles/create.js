import { storage } from 'firebase-admin'
// import vision from '@google-cloud/vision'
// import sharp from 'sharp'
import uuid from 'uuid/v4'

// const cropHints = async path => {
//   const { storageBucket } = storage().app.options
//   const client = new vision.ImageAnnotatorClient()
//   try {
//     const results = await client.cropHints(`gs://${storageBucket}/${path}`)
//     if (!results.lengh) {
//       console.log('no result')
//       return
//     }
//     const [result] = results
//     console.log(result)
//     console.log(result.cropHintsAnnotation)
//   } catch (err) {
//     console.error(err)
//   }
// }

// const resizePhoto = async path => {
//   const bucket = storage().bucket()
//   const [buffer] = await bucket.file(path).download()
//   const resized = await sharp(buffer).resize(250).toBuffer()
//   await bucket.file(path).save(resized.toString('base64'))
// }

export default async (req, res) => {
  const { battlesRef } = res.locals
  const userUID = req.header('UserUID')
  const id = uuid()
  const { battle /*, crops */ } = req.body
  const now = new Date().getTime()
  // await cropHints(battle.photo1Path)
  const doc = {
    ...battle,
    id,
    user: userUID,
    active: false,
    createdAt: now,
    updatedAt: now
  }
  await Promise.all([
    // resizePhoto(battle.photo1Path),
    // resizePhoto(battle.photo2Path),
    battlesRef.doc(id).set(doc)
  ])
  res.json(doc)
}
