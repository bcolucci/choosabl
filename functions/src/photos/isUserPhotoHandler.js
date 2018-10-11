const { photosRef } = require('../utils/db')

module.exports = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { photoUID } = req.params
  const snap = await photosRef.doc(photoUID).get()
  if (!snap.exists) {
    res.status(404)
    return next(new Error('Not found.'))
  }
  const photo = snap.data()
  if (photo.user !== userUID) {
    res.status(500)
    return next(new Error('Not allowed.'))
  }
  res.locals.photo = photo
  next()
}
