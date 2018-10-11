const { auth, createRouter } = require('./_app')
const idreg = require('./utils/idreg')
const get = require('./battles/get')
const stats = require('./battles/stats')
const create = require('./battles/create')
const availableForVote = require('./battles/availableForVote')
const toggleStatus = require('./battles/toggleStatus')
const remove = require('./battles/remove')
const isUserBattle = require('./battles/isUserBattleHandler')

const router = createRouter('/battles')
router.get(`/${idreg('battleUID')}?`, auth, get)
router.get(`/stats/${idreg('battleUID')}`, auth, isUserBattle, stats)
router.get('/availableForVote', auth, availableForVote)

router.post('/', auth, create)

router.put(
  `/${idreg('battleUID')}/toggleStatus`,
  auth,
  isUserBattle,
  toggleStatus
)

router.delete(`/${idreg('battleUID')}`, auth, isUserBattle, remove)

module.exports = router
