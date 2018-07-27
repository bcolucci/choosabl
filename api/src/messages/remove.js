import { messagesRef } from '../db'

export default async (req, res) => {
  const { id } = req.params
  await messagesRef.doc(id).delete()
  res.end()
}
