import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { uploadProfileImage } from '../middleware/upload';
import { createUserSchema, updateUserSchema, getUserSchema, getUsersSchema, getProfileImageByUserIdSchema } from '../utils/validation';

const router = Router();

// User management routes
router.post('/', authenticate, authorize(['user.create']), validate(createUserSchema), UserController.createUser);
router.get('/', authenticate, authorize(['user.read']), validate(getUsersSchema), UserController.getUsers);
router.get('/:id', authenticate, authorize(['user.read']), validate(getUserSchema), UserController.getUserById);
router.put('/:id', authenticate, authorize(['user.update']), validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', authenticate, authorize(['user.delete']), validate(getUserSchema), UserController.deleteUser);

// Profile image routes
router.post('/profile-image/upload', 
  authenticate, 
  authorize(['profile.image.upload']), 
  uploadProfileImage, 
  UserController.uploadProfileImage
);

router.delete('/profile-image/delete', 
  authenticate, 
  authorize(['profile.image.delete']), 
  UserController.deleteProfileImage
);

router.get('/profile-image/me', 
  authenticate, 
  authorize(['profile.image.read']), 
  UserController.getProfileImage
);

router.get('/:userId/profile-image', 
  authenticate, 
  authorize(['profile.image.read']), 
  validate(getProfileImageByUserIdSchema), 
  UserController.getProfileImageByUserId
);

export default router;
