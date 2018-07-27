export default (_, res) => {
  const now = new Date().getTime()
  res.end(`Hello from Firebase! ${now}`)
}
