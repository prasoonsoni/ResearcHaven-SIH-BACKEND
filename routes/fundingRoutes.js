import express from 'express';
const router = express.Router();
import fetchUser from '../middleware/fetchUser.js';
import fundingController from '../controllers/fundingController.js';

router.post('/give/:cid', fetchUser, fundingController.giveFunding);
router.get('/', fundingController.getAllFundedProposals);

export default router;