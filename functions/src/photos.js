const { auth, createRouter } = require('./_app')
const idreg = require('./utils/idreg')
const get = require('./photos/get')
const face = require('./photos/face')
const create = require('./photos/create')
const remove = require('./photos/remove')
const isUserPhoto = require('./photos/isUserPhotoHandler')

const router = createRouter('/photos')
router.get('/', auth, get)
router.get('/face/:path', auth, face)

router.post('/', auth, create)

router.delete(`/${idreg('photoUID')}/:path`, auth, isUserPhoto, remove)

module.exports = router
