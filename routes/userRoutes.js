const express = require('express')

const router = express.Router()
const userController = require('../controllers/userController')
const fetchUser = require('../middleware/fetchUser')

router.post('/create', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/verify/:token', userController.verifyUser)
router.post('/send-verify-mail', userController.sendVerificationEmail)
router.get('/', fetchUser, userController.getUser)
router.get('/:id', userController.getUserById)

module.exports = router
