import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { uploadFile } from '../middleware/upload';
import { getFileSchema, getUserFilesSchema } from '../utils/validation';

const router = Router();

// Routes
router.post('/upload', authenticate, authorize(['file.upload']), uploadFile, FileController.uploadFile);
router.get('/', authenticate, authorize(['file.read']), validate(getUserFilesSchema), FileController.getUserFiles);
router.get('/:id', authenticate, authorize(['file.read']), validate(getFileSchema), FileController.getFileInfo);
router.get('/:id/download', authenticate, authorize(['file.read']), validate(getFileSchema), FileController.downloadFile);
router.delete('/:id', authenticate, authorize(['file.delete']), validate(getFileSchema), FileController.deleteFile);

export default router;
