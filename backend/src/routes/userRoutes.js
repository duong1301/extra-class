import express from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { validateCreateUser, validateUpdateUser } from '../validators/userValidator.js';
import { validateId } from '../validators/idValidator.js';

const router = express.Router();

router.route('/').get(getUsers).post(validateCreateUser, createUser);
router.route('/:id').get(validateId, getUserById).put(validateId, validateUpdateUser, updateUser).delete(validateId, deleteUser);

export default router;
