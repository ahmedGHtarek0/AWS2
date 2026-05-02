import express from 'express';
import multer from 'multer';
import { uploadPrescription, checkInteraction, savePrescription, getHistory } from '../controllers/coreController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', authMiddleware, upload.single('prescription'), uploadPrescription);
router.post('/check-interaction', authMiddleware, checkInteraction);
router.post('/prescriptions', authMiddleware, savePrescription);
router.get('/prescriptions', authMiddleware, getHistory);

export default router;
