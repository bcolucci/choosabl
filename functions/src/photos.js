const { auth, createRouter } = require('./_app')
const get = require('./photos/get')
const face = require('./photos/face')
const create = require('./photos/create')

const router = createRouter('/photos')
router.get('/', auth, get)
router.post('/', auth, create)
router.get('/face/:path', auth, face)

module.exports = router
