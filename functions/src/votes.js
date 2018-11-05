const { auth, createRouter } = require('./app')
const idreg = require('./utils/idreg')
const routes = require('./votes/routes')

const router = createRouter('/votes')
router.get(`/${idreg('battleUID')}`, auth, routes.get)
router.post(`/${idreg('battleUID')}/:voteFor(0|1)`, auth, routes.create)

module.exports = router
