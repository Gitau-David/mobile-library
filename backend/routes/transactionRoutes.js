import express from 'express';
import { checkoutAsset, distributedReturnAsset } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/checkout', checkoutAsset);
router.post('/return',   distributedReturnAsset);

export default router;
