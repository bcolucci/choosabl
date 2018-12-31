const uuid = require('uuid/v4')
const DB = require('../../utils/db')

const create = async ({ userUID, photo }) => {
  const id = uuid()
  const now = new Date().getTime()
  const doc = {
    id,
    user: userUID,
    ...photo,
    createdAt: now,
    updatedAt: now
  }
  await DB.photosRef.doc(id).set(doc)
  return doc
}

const remove = photoUID => DB.photosRef.doc(photoUID).delete()

const findUserUsedPhotos = async userUID => {
  const photos = []
  const iterator = await DB.battlesRef.where('user', '==', userUID).get()
  iterator.forEach(snap => {
    const { photo1, photo2 } = snap.data()
    ;[(photo1, photo2)].forEach(
      photo => !photos.includes(photo) && photos.push(photo)
    )
  })
  return photos
}

const findByUser = async userUID => {
  const photos = []
  const usedPhotos = await findUserUsedPhotos(userUID)
  const iterator = await DB.photosRef
    .where('user', '==', userUID)
    .orderBy('createdAt', 'desc')
    .get()
  iterator.forEach(snap => {
    const photo = snap.data()
    const used = usedPhotos.includes(photo.id)
    photos.push({ ...photo, used })
  })
  return photos
}

module.exports = {
  create,
  remove,
  findUserUsedPhotos,
  findByUser
}
