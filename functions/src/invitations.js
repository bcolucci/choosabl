const { auth, createRouter } = require('./app')
const routes = require('./invitations/routes')

const router = createRouter('/invitations')
router.get('/', auth, routes.invitedBy)
router.get('/:invited', auth, routes.isInvited)
router.post('/', auth, routes.create)

module.exports = router
