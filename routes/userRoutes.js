const express = require('express')

const router = express.Router()
const userController = require('../controllers/userController')
const fetchUser = require('../middleware/fetchUser')

router.post('/create', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/verify/:token', userController.verifyUser)
router.post('/send-verify-mail', userController.sendVerificationEmail)
router.get('/get-user/', fetchUser, userController.getUser)
router.get('/get-user/:id', userController.getUserById)

module.exports = router
