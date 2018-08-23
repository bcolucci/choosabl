const { storage } = require('firebase-admin')
const Vision = require('@google-cloud/vision')

const client = new Vision.ImageAnnotatorClient()
const bucket = storage().app.options.storageBucket

const detectFaces = async ({ uri, persist }) => {
  const request = {
    image: {
      source: {
        gcsImageUri: uri
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
    return Promise.resolve()
  }
  if (persist) {
    await storage()
      .bucket(bucket)
      .file(
        '/vision/' +
          uri
            .split('/')
            .slice(-2)
            .join('/')
      )
      .save(JSON.stringify(results), { contentType: 'application/json' })
  }
  return results
}

const detectBattleFaces = ({ battle, persist }) =>
  Promise.all([
    detectFaces({ uri: `${bucket}/${battle.photo1Path}`, persist }),
    detectFaces({ uri: `${bucket}/${battle.photo2Path}`, persist })
  ])

module.exports = {
  bucket,
  detectFaces,
  detectBattleFaces
}
