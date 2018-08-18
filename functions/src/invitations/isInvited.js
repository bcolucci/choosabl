module.exports = async (req, res) => {
  const { invitationsRef } = res.locals
  const { invited } = req.params
  const userUID = req.header('UserUID')
  const iterator = await invitationsRef
    .where('user', '==', userUID)
    .where('invited', '==', invited)
    .get()
  res.json(iterator.size > 0)
}
