const { bucket, detectFaces } = require('../utils/vision')

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const { path } = req.params
  const rawPath = new Buffer(path, 'base64').toString('utf8')
  if (!new RegExp(`\/${userUID}\/`).test(rawPath)) {
    return res.status(500).end('Not allowed.')
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
