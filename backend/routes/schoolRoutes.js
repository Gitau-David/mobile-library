import express from 'express';
import { getSchools, createSchool, updateSchool, deleteSchool } from '../controllers/schoolController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/',     getSchools);
router.post('/',    createSchool);
router.put('/:id',  updateSchool);
router.delete('/:id', deleteSchool);

export default router;
