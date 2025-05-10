import express from 'express';
import {
    getPayUrlForOrder,
    vnPayIPNHandle
} from '../controllers/payment.controller.js'

const router = express.Router();

router.get('/payUrl/:orderID', getPayUrlForOrder);
router.get('/ipn', vnPayIPNHandle)

export default router;
