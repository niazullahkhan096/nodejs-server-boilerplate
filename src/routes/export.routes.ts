import { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { exportUsersSchema, exportStatsSchema } from '../utils/validation';

const router = Router();

// Export users to CSV (requires user.read permission)
router.get('/users/csv', 
  authenticate, 
  authorize(['user.read']), 
  validate(exportUsersSchema),
  ExportController.exportUsers
);

// Get available export fields
router.get('/users/fields', 
  authenticate, 
  authorize(['user.read']), 
  ExportController.getExportFields
);

// Get export statistics
router.get('/users/stats', 
  authenticate, 
  authorize(['user.read']), 
  validate(exportStatsSchema),
  ExportController.getExportStats
);

export default router;
