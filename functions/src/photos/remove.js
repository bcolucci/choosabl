const { storage } = require('firebase-admin')
const { photosRef } = require('../utils/db')

const bucket = storage().app.options.storageBucket

module.exports = async (req, res) => {
  const { photoUID, path } = req.params
  const decodedPath = '/' + Buffer.from(path, 'base64')
  try {
    await Promise.all([
      photosRef.doc(photoUID).delete(),
      storage()
        .bucket(bucket)
        .file(decodedPath)
        .delete()
    ])
  } catch (err) {}
  res.end()
}
