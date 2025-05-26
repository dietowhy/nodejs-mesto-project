import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser
} from '../controllers/userController';
import auth from '../middleware/auth';
import {
  validateAvatarUpdate,
  validateUserId,
  validateUserUpdate,
} from '../middleware/validator'

const router = Router();

router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserById);
router.get('/me', auth, getCurrentUser);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

export default router;