const { auth, createRouter } = require('./app')
const idreg = require('./utils/idreg')
const handlers = require('./photos/handlers')
const routes = require('./photos/routes')

const router = createRouter('/photos')
router.get('/', auth, routes.get)
router.get('/face/:path', auth, routes.face)
router.post('/', auth, routes.create)
router.delete(
  `/${idreg('photoUID')}/:path`,
  auth,
  handlers.isUserPhoto,
  routes.remove
)

module.exports = router
