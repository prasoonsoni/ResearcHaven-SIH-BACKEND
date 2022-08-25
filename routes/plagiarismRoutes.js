import express from 'express'
const router = express.Router()
import fetchUser from '../middleware/fetchUser.js'
import plagiarismController from '../controllers/plagiarismController.js'

router.post('/levelOne/:id', fetchUser, plagiarismController.levelOne)
router.post('/levelTwo/:id', fetchUser, plagiarismController.levelTwo)
router.get('/levelOne/:id', fetchUser, plagiarismController.getLevelOneReports)
router.get('/levelTwo/:id', fetchUser, plagiarismController.getLevelTwoReports)

export default router