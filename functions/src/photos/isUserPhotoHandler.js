module.exports = async (req, res, next) => {
  const { photosRef } = res.locals
  const userUID = req.header('UserUID')
  const { photoUID } = req.params
  const snap = await photosRef.doc(photoUID).get()
  if (!snap.exists || snap.data().user !== userUID) {
    res.status(500)
    return next(new Error('Not allowed.'))
  }
  res.locals.photo = snap.data()
  next()
}
