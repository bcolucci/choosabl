module.exports = async (req, res, next) => {
  const { battlesRef } = res.locals
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  const snap = await battlesRef.doc(battleUID).get()
  if (!snap.exists || snap.data().user !== userUID) {
    res.status(500)
    return next(new Error('Not allowed.'))
  }
  res.locals.battle = snap.data()
  next()
}
