import { messagesRef } from '../db'

export default async () => {
  const messages = []
  const snap = await messagesRef.get()
  snap.forEach(doc => messages.push(doc.data()))
  return messages
}
