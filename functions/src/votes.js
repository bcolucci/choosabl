const { auth, createRouter } = require('./app')
const get = require('./votes/get')
const create = require('./votes/create')
const idreg = require('./utils/idreg')

const router = createRouter('/votes')
router.get(`/${idreg('battleUID')}`, auth, get)

router.post(`/${idreg('battleUID')}/:voteFor(0|1)`, auth, create)

module.exports = router
