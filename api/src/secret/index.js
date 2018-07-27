import { auth } from 'firebase-admin'

export default async (req, res) => {
  const { token } = req.headers
  const decodedToken = await auth().verifyIdToken(token)
  res.json(decodedToken)
}
