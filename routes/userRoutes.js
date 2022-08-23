import express from 'express'
const router = express.Router()
import userController from '../controllers/userController.js'
import fetchUser from '../middleware/fetchUser.js'

router.post('/create', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/verify/:token', userController.verifyUser)
router.post('/send-verify-mail', userController.sendVerificationEmail)
router.get('/', fetchUser, userController.getUser)
router.get('/:id', userController.getUserById)

export default router
