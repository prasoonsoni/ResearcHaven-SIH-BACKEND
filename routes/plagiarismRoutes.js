import express from 'express'
const router = express.Router()
import fetchUser from '../middleware/fetchUser.js'
import plagiarismController from '../controllers/plagiarismController.js'

router.post('/levelOne/:id', fetchUser, plagiarismController.levelOne)

export default router