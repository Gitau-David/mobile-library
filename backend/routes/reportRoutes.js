import express from 'express';
import { getDashboardMetrics, getReportsData } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/metrics', getDashboardMetrics);
router.get('/data',    getReportsData);

export default router;
