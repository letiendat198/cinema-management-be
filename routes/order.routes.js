import express from 'express';
import {
    createOrder,
    confirmOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId 
} from '../controllers/order.controller.js';
// import { authenticate } from '../middleware/auth.js'; // Add auth if needed

const router = express.Router();

router.get('/', getAllOrders);

// router.post('/', authenticate, createOrder); // Requires logged in
router.post('/', createOrder); 
router.get('/:orderID', getOrderById);
router.post('/:orderID/confirm', confirmOrder);


export default router;
