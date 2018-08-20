const { storage } = require('firebase-admin')
const Vision = require('@google-cloud/vision')

const client = new Vision.ImageAnnotatorClient()
const bucket = storage().app.options.storageBucket

const detectFaces = async gcsImageUri => {
  console.log('gcsImageUri', gcsImageUri)
  const request = {
    image: {
      source: {
        gcsImageUri
      }
    },
    imageContext: {
      cropHintsParams: {
        aspectRatios: [0.75]
      }
    }
  }
  const results = await client.faceDetection(request)
  if (!results || !results.length) {
    console.log(gcsImageUri, 'NO RESULT')
    return Promise.resolve()
  }
  return storage()
    .bucket(bucket)
    .file(
      '/vision/' +
        gcsImageUri
          .split('/')
          .slice(-2)
          .join('/')
    )
    .save(JSON.stringify(results), { contentType: 'application/json' })
}

const detectBattleFaces = battle =>
  Promise.all([
    detectFaces(`${bucket}/${battle.photo1Path}`),
    detectFaces(`${bucket}/${battle.photo2Path}`)
  ])

module.exports = {
  detectFaces,
  detectBattleFaces
}
