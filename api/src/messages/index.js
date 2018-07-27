import express from 'express'
import get from './getAll'
import add from './add'
import remove from './remove'

const router = express.Router()

router.get('/', get)
router.post('/', add)
router.delete('/:id', remove)

export default router
