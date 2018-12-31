const { storage } = require('firebase-admin')
const errors = require('../errors')
const { detectFaces } = require('../utils/vision')
const repository = require('./repository')

const bucket = storage().app.options.storageBucket

const create = (req, res, next) => {
  const { photo } = req.body
  const userUID = req.header('UserUID')
  repository
    .create({ userUID, photo })
    .then(doc => res.json(doc))
    .catch(err => next(err))
}

const remove = async (req, res, next) => {
  const { photoUID, path } = req.params
  Promise.all([
    repository.remove(photoUID),
    storage()
      .bucket(bucket)
      .file('/' + Buffer.from(path, 'base64'))
      .delete()
  ])
    .then(() => res.end())
    .catch(err => next(err))
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

const get = (req, res, next) => {
  const userUID = req.header('UserUID')
  repository
    .findByUser(userUID)
    .then(photos => res.json(photos))
    .catch(err => next(err))
}

module.exports = {
  create,
  remove,
  face,
  get
}
