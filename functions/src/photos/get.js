module.exports = async (req, res) => {
  const userUID = req.header('UserUID')
  const { photosRef } = res.locals
  const photos = []
  const iterator = await photosRef
    .where('user', '==', userUID)
    .orderBy('createdAt', 'desc')
    .get()
  iterator.forEach(snap => photos.push(snap.data()))
  res.json(photos)
}
