const { auth, createRouter } = require('./app')
const isInvited = require('./invitations/isInvited')
const invited = require('./invitations/invited')
const create = require('./invitations/create')

const router = createRouter('/invitations')
router.get('/', auth, invited)
router.get('/:invited', auth, isInvited)

router.post('/', auth, create)

module.exports = router
