import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import permissionRoutes from './permission.routes';
import fileRoutes from './file.routes';
import exportRoutes from './export.routes';

const router = Router();

import { sendSuccess, getLanguageFromRequest } from '../utils/apiResponse';

// Health check endpoints
router.get('/healthz', (req, res) => {
  const language = getLanguageFromRequest(req);
  sendSuccess(res, { timestamp: new Date().toISOString() }, 'health.success', 200, language);
});

router.get('/readyz', (req, res) => {
  const language = getLanguageFromRequest(req);
  sendSuccess(res, { timestamp: new Date().toISOString() }, 'ready.success', 200, language);
});

// API routes
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/roles', roleRoutes);
router.use('/api/v1/permissions', permissionRoutes);
router.use('/api/v1/files', fileRoutes);
router.use('/api/v1/export', exportRoutes);

export default router;
