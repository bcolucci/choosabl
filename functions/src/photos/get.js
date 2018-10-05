// TODO move out
const useUsedPhotos = async (battlesRef, userUID) => {
  const photos = []
  const iterator = await battlesRef.where('user', '==', userUID).get()
  iterator.forEach(snap => {
    const { photo1, photo2 } = snap.data()
    ;[(photo1, photo2)].forEach(
      photo => !photos.includes(photo) && photos.push(photo)
    )
  })
  return photos
}

module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const { photosRef, battlesRef } = res.locals
  const photos = []
  const usedPhotos = await useUsedPhotos(battlesRef, userUID)
  const iterator = await photosRef
    .where('user', '==', userUID)
    .orderBy('createdAt', 'desc')
    .get()
  iterator.forEach(snap => {
    const photo = snap.data()
    const used = usedPhotos.includes(photo.id)
    photos.push({ ...photo, used })
  })
  res.json(photos)
}
