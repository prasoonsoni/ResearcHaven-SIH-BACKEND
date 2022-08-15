const express = require('express')
const router = express.Router()
const researchPaperController = require('../controllers/researchPaperController')
const fetchUser = require('../middleware/fetchUser')

router.post('/add',fetchUser, researchPaperController.createResearchPaper)
router.put('/update/:id', fetchUser, researchPaperController.editResearchPaper)

module.exports = router