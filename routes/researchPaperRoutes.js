import express from 'express'
const router = express.Router()
import researchPaperController from '../controllers/researchPaperController.js'
import fetchUser from '../middleware/fetchUser.js'

router.post('/create', fetchUser, researchPaperController.createResearchPaper)
router.put('/update/:id', fetchUser, researchPaperController.editResearchPaper)
router.delete('/delete/:id', fetchUser, researchPaperController.deleteResearchPaper)
router.get('/published', researchPaperController.getAllPublishedResearchPapers)
router.get('/published-by-user', fetchUser, researchPaperController.getAllPublishedResearchPapersByUser)
router.get('/draft-research-papers', fetchUser, researchPaperController.getDraftResearchPapers)
router.get('/draft/:id', fetchUser, researchPaperController.getDraftById)
router.post('/submit/:id', fetchUser, researchPaperController.submitPaper)

export default router
