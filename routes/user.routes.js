//tam thoi thieu auth vi chua review code chatgpt
import express from 'express';
import { body } from 'express-validator';
// import { validate } from '../middleware/validator.js';
// import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserRank,
  getUserPoints,
  registerUser
} from '../controllers/user.controller.js';

const router = express.Router();

// User registration validation
const registerValidation = [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// User login validation
const loginValidation = [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// User update validation
const updateValidation = [
  body('username').optional().isString().trim().notEmpty().withMessage('Username cannot be empty'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Public routes (no authentication needed)
// router.post('/register', validate(registerValidation), registerUser);
// router.post('/login', validate(loginValidation), loginUser);

// Protected routes (authentication required)
router.post('/register', registerUser);
router.get('/', getAllUsers);
router.get('/:userID', getUserById);
router.put('/:userID', updateUser);
router.delete('/:userID',deleteUser);
router.get('/:userID/rank', getUserRank);
router.get('/:userID/points', getUserPoints);

export default router;
