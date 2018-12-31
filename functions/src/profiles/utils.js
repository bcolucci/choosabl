const sillyname = require('sillyname')

const createProfile = ({ uuid, email, referrer }) => {
  const now = new Date()
  const username = `${sillyname()} ${Math.ceil(Math.random() * 99)}`
  return {
    id: uuid,
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

module.exports = {
  createProfile
}
