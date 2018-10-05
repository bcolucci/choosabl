const { storage } = require('firebase-admin')

const bucket = storage().app.options.storageBucket

module.exports = async (req, res) => {
  const { photosRef } = res.locals
  const { photoUID, path } = req.params
  const decodedPath = '/' + Buffer.from(path, 'base64')
  try {
    await Promise.all([
      photosRef.doc(photoUID).delete(),
      storage().bucket(bucket).file(decodedPath).delete()
    ])
  } catch (err) {}
  res.end()
}
