
import express from 'express';
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

// Protected routes (authentication required)
router.post('/register', registerUser);
router.get('/', getAllUsers);
router.get('/:userID', getUserById);
router.put('/:userID', updateUser);
router.delete('/:userID',deleteUser);
router.get('/:userID/rank', getUserRank);
router.get('/:userID/points', getUserPoints);

export default router;
