import express from 'express';
const router = express.Router();
import fetchUser from '../middleware/fetchUser.js';
import fundingController from '../controllers/fundingController.js';
import expertController from '../controllers/expertController.js';

router.get('/all', fetchUser, expertController.getAllProposals);
router.post('/verify/:cid', fetchUser, expertController.verifyProposal);

export default router;