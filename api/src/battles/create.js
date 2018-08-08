import { storage } from 'firebase-admin'
import vision from '@google-cloud/vision'
import sharp from 'sharp'
import uuid from 'uuid/v4'

const cropHints = async path => {
  const { storageBucket } = storage().app.options
  const client = new vision.ImageAnnotatorClient()
  try {
    const results = await client.cropHints(`gs://${storageBucket}/${path}`)
    if (!results.lengh) {
      console.log('no result')
      return
    }
    const [result] = results
    console.log(result)
    console.log(result.cropHintsAnnotation)
  } catch (err) {
    console.error(err)
  }
}

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

export default async (req, res) => {
  const { battlesRef } = res.locals
  const userUID = req.header('UserUID')
  const id = uuid()
  const { battle, crops } = req.body
  const now = new Date().getTime()
  await cropHints(battle.photo1Path)
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
}
