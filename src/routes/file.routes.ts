import { Router } from 'express';
import multer from 'multer';
import { FileController } from '../controllers/file.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { env } from '../config';
import { getFileSchema, getUserFilesSchema } from '../utils/validation';

const router = Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, you can add restrictions here
    cb(null, true);
  },
});

// Routes
router.post('/upload', authenticate, authorize(['file.upload']), upload.single('file'), FileController.uploadFile);
router.get('/', authenticate, authorize(['file.read']), validate(getUserFilesSchema), FileController.getUserFiles);
router.get('/:id', authenticate, authorize(['file.read']), validate(getFileSchema), FileController.getFileInfo);
router.get('/:id/download', authenticate, authorize(['file.read']), validate(getFileSchema), FileController.downloadFile);
router.delete('/:id', authenticate, authorize(['file.delete']), validate(getFileSchema), FileController.deleteFile);

export default router;
