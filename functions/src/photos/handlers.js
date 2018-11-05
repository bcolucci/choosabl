const errors = require('../errors')
const DB = require('../utils/db')

const isUserPhoto = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { photoUID } = req.params
  const snap = await DB.photosRef.doc(photoUID).get()
  if (!snap.exists) {
    res.status(404)
    return next(errors.NotFound)
  }
  const photo = snap.data()
  if (photo.user !== userUID) {
    res.status(500)
    return next(errors.AccessDenied)
  }
  res.locals.photo = photo
  next()
}

module.exports = {
  isUserPhoto
}
