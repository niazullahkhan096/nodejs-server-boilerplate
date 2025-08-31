import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema, getUserSchema, getUsersSchema } from '../utils/validation';

const router = Router();

// Routes
router.post('/', authenticate, authorize(['user.create']), validate(createUserSchema), UserController.createUser);
router.get('/', authenticate, authorize(['user.read']), validate(getUsersSchema), UserController.getUsers);
router.get('/:id', authenticate, authorize(['user.read']), validate(getUserSchema), UserController.getUserById);
router.put('/:id', authenticate, authorize(['user.update']), validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', authenticate, authorize(['user.delete']), validate(getUserSchema), UserController.deleteUser);


export default router;
