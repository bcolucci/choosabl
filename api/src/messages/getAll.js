import getMessages from './getMessages'

export default async (req, res) => {
  const messages = await getMessages()
  res.json(messages)
}
