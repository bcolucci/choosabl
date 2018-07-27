import { auth } from 'firebase-admin'

export default async (req, res) => {
  const { token } = req.headers
  if (!token) {
    res.status(403)
    res.end('Token required')
    return
  }
  const decodedToken = await auth().verifyIdToken(token)
  res.json(decodedToken)
}
