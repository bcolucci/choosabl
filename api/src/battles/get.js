export default async (req, res) => {
  const { battlesRef } = res.locals
  const userUID = req.header('UserUID')
  const { battleUID } = req.params
  if (battleUID) {
    const battle = await battlesRef.doc(battleUID).get()
    if (!battle.exists) {
      return res.status(500).end('Not found.')
    }
    if (battle.user !== userUID) {
      return res.status(500).end('Not allowed.')
    }
    return res.json(battle)
  }
  const battles = []
  const iterator = await battlesRef
    .where('user', '==', userUID)
    .orderBy('updatedAt', 'desc')
    .get()
  iterator.forEach(snap => battles.push(snap.data()))
  res.json(battles)
}
