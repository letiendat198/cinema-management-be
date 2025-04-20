import express from 'express';
import {
  getAllComplementItems,
  getComplementItemById,
  createComplementItem,
  updateComplementItem,
  deleteComplementItem
} from '../controllers/complementitem.controller.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllComplementItems);
router.get('/:itemID', getComplementItemById);

// Admin routes 
// router.post('/', authenticate, authorize(['admin']), createComplementItem);
// router.put('/:itemID', authenticate, authorize(['admin']), updateComplementItem);
// router.delete('/:itemID', authenticate, authorize(['admin']), deleteComplementItem);
// without auth
router.post('/', createComplementItem);
router.put('/:itemID', updateComplementItem);
router.delete('/:itemID', deleteComplementItem);


export default router;
