import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createRoleSchema, updateRoleSchema, getRoleSchema } from '../utils/validation';

const router = Router();

// Routes
router.post('/', authenticate, authorize(['role.create']), validate(createRoleSchema), RoleController.createRole);
router.get('/', authenticate, authorize(['role.read']), RoleController.getRoles);
router.get('/:id', authenticate, authorize(['role.read']), validate(getRoleSchema), RoleController.getRoleById);
router.put('/:id', authenticate, authorize(['role.update']), validate(updateRoleSchema), RoleController.updateRole);
router.delete('/:id', authenticate, authorize(['role.delete']), validate(getRoleSchema), RoleController.deleteRole);

export default router;
