import express from 'express';
import {
    getPayUrlForOrder
} from '../controllers/payment.controller.js'

const router = express.Router();

router.get('/payUrl/:orderID', getPayUrlForOrder);

export default router;
