import casual from 'casual'
import { messagesRef } from '../db'

export default async (_, res) => {
  await messagesRef.add({ text: casual.sentence })
  res.end()
}
