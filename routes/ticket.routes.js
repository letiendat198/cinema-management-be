import express from 'express';
import {
    getAllTickets,
    getTicketsByUserId,
    getTicketById,
    cancelTicket,
} from '../controllers/ticket.controller.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tickets (Admin)
// router.get('/', authenticate, authorize(['admin']), getAllTickets);
router.get('/', getAllTickets); // For testing
router.get('/:ticketID', getTicketById);
// Cancel ticket
router.delete('/:ticketID', cancelTicket); 

export default router;
