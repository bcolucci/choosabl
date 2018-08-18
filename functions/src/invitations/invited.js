module.exports = async (req, res) => {
  const { invitationsRef } = res.locals
  const invited = []
  const userUID = req.header('UserUID')
  const iterator = await invitationsRef.where('user', '==', userUID).get()
  iterator.forEach(snap => invited.push(snap.data().invited))
  res.json(invited)
}
