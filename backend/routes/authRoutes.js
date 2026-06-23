import express from 'express';
import { login, verifySession } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login',   login);
router.get('/session',  protect, verifySession);

export default router;
