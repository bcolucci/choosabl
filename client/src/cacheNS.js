export default k => ({
  get: (def = null) => {
    const json = localStorage.getItem(k)
    if (!json) {
      return def
    }
    return JSON.parse(json)
  },
  set: obj => {
    try {
      localStorage.setItem(k, JSON.stringify(obj))
    } catch (err) {
      if (err.message.match(/exceeded the quota/)) {
        return
      }
      throw err
    }
  },
  unset: () => localStorage.removeItem(k)
})
