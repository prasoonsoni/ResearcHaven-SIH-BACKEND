const express = require('express')
const router = express.Router()
const researchPaperController = require('../controllers/researchPaperController')
const fetchUser = require('../middleware/fetchUser')

router.post('/add',fetchUser, researchPaperController.createResearchPaper)

module.exports = router