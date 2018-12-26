const { storage } = require('firebase-admin')
const errors = require('../errors')
const { detectFaces } = require('../utils/vision')
const repository = require('./repository')

const bucket = storage().app.options.storageBucket

const create = async (req, res) => {
  const { photo } = req.body
  const userUID = req.header('UserUID')
  const doc = await repository.create({ userUID, photo })
  res.json(doc)
}

const remove = async (req, res) => {
  const { photoUID, path } = req.params
  const decodedPath = '/' + Buffer.from(path, 'base64')
  try {
    await Promise.all([
      repository.remove(photoUID),
      storage()
        .bucket(bucket)
        .file(decodedPath)
        .delete()
    ])
  } catch (err) {}
  res.end()
}

const face = async (req, res) => {
  const userUID = req.header('UserUID')
  const { path } = req.params
  const rawPath = new Buffer(path, 'base64').toString('utf8')
  if (!new RegExp(`\/${userUID}\/`).test(rawPath)) {
    return res.status(500).end(errors.AccessDenied)
  }
  const [result] = await detectFaces({ uri: `${bucket}/${rawPath}` })
  if (!result) {
    return res.json({})
  }
  const { faceAnnotations } = result
  if (!faceAnnotations.length) {
    return res.json({})
  }
  res.json(faceAnnotations.shift())
}

const get = async (req, res) => {
  const userUID = req.header('UserUID')
  const photos = await repository.findByUser(userUID)
  res.json(photos)
}

module.exports = {
  create,
  remove,
  face,
  get
}
