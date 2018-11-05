module.exports = (req, res, next) => {
  const key = `[timer] ${req.originalUrl}`
  console.time(key)
  next()
  console.timeEnd(key)
}
