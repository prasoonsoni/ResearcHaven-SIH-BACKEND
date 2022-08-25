import express from 'express'
const router = express.Router()
import researchProposalController from '../controllers/researchProposalController.js'
import fetchUser from '../middleware/fetchUser.js'

router.post('/create', fetchUser, researchProposalController.createResearchProposal)
router.put('/update/:id', fetchUser, researchProposalController.editResearchProposal)
router.delete('/delete/:id', fetchUser, researchProposalController.deleteResearchProposal)
router.get('/submitted', researchProposalController.getAllSubmittedResearchProposals)
router.get('/submitted/:cid', researchProposalController.getSubmittedResearchProposalById)
router.get('/submitted-by-user', fetchUser, researchProposalController.getAllSubmittedResearchProposalsByUser)
router.get('/draft', fetchUser, researchProposalController.getDraftResearchProposals)
router.get('/draft/:id', fetchUser, researchProposalController.getDraftById)
router.post('/submit/:id', fetchUser, researchProposalController.submitProposal)

export default router
