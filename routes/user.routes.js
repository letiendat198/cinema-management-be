import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserRank,
  getUserPoints,
  registerUser,
  loginUser
} from '../controllers/user.controller.js';
import { getOrdersByUserId } from '../controllers/order.controller.js';
import { getTicketsByUserId } from '../controllers/ticket.controller.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User info routes
router.get('/', getAllUsers);
router.get('/:userID', getUserById);
router.put('/:userID', updateUser);
router.delete('/:userID', deleteUser);
router.get('/:userID/rank', getUserRank);
router.get('/:userID/points', getUserPoints);

// User-specific orders and tickets
router.get('/:userID/orders', getOrdersByUserId);
router.get('/:userID/tickets', getTicketsByUserId);

export default router;
