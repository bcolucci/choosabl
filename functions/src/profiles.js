const { auth, createRouter } = require('./app')
const routes = require('./profiles/routes')

const router = createRouter('/profiles')
router.get('/', auth, routes.get)
router.get('/stats', auth, routes.stats)
router.get('/auth/linkedin', routes.linkedinAuth)
router.post('/', auth, routes.create)
router.put('/', auth, routes.update)

module.exports = router
