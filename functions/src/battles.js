const { auth, createRouter } = require('./app')
const idreg = require('./utils/idreg')
const handlers = require('./battles/handlers')
const routes = require('./battles/routes')

const router = createRouter('/battles')
router.get(`/${idreg('battleUID')}?`, auth, routes.get)
router.get(
  `/stats/${idreg('battleUID')}`,
  auth,
  handlers.isUserBattle,
  routes.stats
)
router.get('/availableForVote', auth, routes.availableForVote)
router.post('/', auth, routes.create)
router.put(
  `/${idreg('battleUID')}/toggleStatus`,
  auth,
  handlers.isUserBattle,
  routes.toggleStatus
)
router.delete(
  `/${idreg('battleUID')}`,
  auth,
  handlers.isUserBattle,
  routes.remove
)

module.exports = router
