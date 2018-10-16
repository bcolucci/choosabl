const { auth, createRouter } = require('./app')
const get = require('./profiles/get')
const stats = require('./profiles/stats')
const create = require('./profiles/create')
const update = require('./profiles/update')
const linkedin = require('./profiles/linkedin')

const router = createRouter('/profiles')
router.get('/', auth, get)
router.get('/stats', auth, stats)

router.get('/auth/linkedin', linkedin)

router.post('/', auth, create)
router.put('/', auth, update)

module.exports = router
