const sillyname = require('sillyname')

module.exports = ({ email, referrer }) => {
  const now = new Date().getTime()
  const username = `${sillyname()} ${Math.ceil(Math.random() * 99)}`
  return {
    username,
    birthday: null,
    gender: '',
    votes: 3,
    email: email || null,
    referrer: referrer || null,
    createdAt: now,
    updatedAt: now
  }
}
