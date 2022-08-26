import express from 'express';
const router = express.Router();
import fetchUser from '../middleware/fetchUser.js';
import fundingController from '../controllers/fundingController.js';

router.post('/give/:cid', fetchUser, fundingController.giveFunding);
router.get('/', fundingController.getAllFundedProposals);
router.get('/user', fetchUser, fundingController.getAllFundedProposalsByUser);
router.post('/reject/:cid', fetchUser, fundingController.rejectFunding);
router.get('/rejected', fetchUser, fundingController.getAllRejectedProposalsBuUser);
router.post('/send-to-experts/:cid', fetchUser, fundingController.sendToExperts);
router.get('/scores/:cid', fetchUser, fundingController.getAllScoresByCid);
export default router;