export default k => ({
  get: (def = null) => {
    const json = localStorage.getItem(k)
    if (!json || !json.length) {
      return def
    }
    const { ttl, ts, obj } = JSON.parse(json)
    if (ttl && new Date().getTime() - ts > ttl) {
      localStorage.removeItem(k)
      return def
    }
    return [null, undefined].includes(obj) ? def : obj
  },
  set: (obj, ttl = 15 * 60 * 60) => {
    const item = { obj, ttl, ts: new Date().getTime() }
    try {
      localStorage.setItem(k, JSON.stringify(item))
    } catch (err) {
      if (err.message.match(/exceeded the quota/)) {
        return
      }
      throw err
    }
  },
  unset: () => localStorage.removeItem(k)
})
