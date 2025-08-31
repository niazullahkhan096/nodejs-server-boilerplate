import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createPermissionSchema, updatePermissionSchema, getPermissionSchema } from '../utils/validation';

const router = Router();

// Routes
router.post('/', authenticate, authorize(['permission.create']), validate(createPermissionSchema), PermissionController.createPermission);
router.get('/', authenticate, authorize(['permission.read']), PermissionController.getPermissions);
router.get('/:id', authenticate, authorize(['permission.read']), validate(getPermissionSchema), PermissionController.getPermissionById);
router.put('/:id', authenticate, authorize(['permission.update']), validate(updatePermissionSchema), PermissionController.updatePermission);
router.delete('/:id', authenticate, authorize(['permission.delete']), validate(getPermissionSchema), PermissionController.deletePermission);

export default router;
