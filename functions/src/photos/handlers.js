const errors = require('../errors')
const repository = require('./repository')

const isUserPhoto = async (req, res, next) => {
  const userUID = req.header('UserUID')
  const { photoUID } = req.params
  const photo = await repository.findById(photoUID)
  if (!photo) {
    res.status(404)
    return next(errors.NotFound)
  }
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
