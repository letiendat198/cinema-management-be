import express from 'express';
import {
    getAllTickets,
    getTicketsByUserId,
    getTicketById,
    cancelTicket,
    getTicketsByScheduleId,
} from '../controllers/ticket.controller.js';
// import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tickets (Admin)
// router.get('/', authenticate, authorize(['admin']), getAllTickets);
router.get('/', getAllTickets); // For testing
router.get('/:ticketID', getTicketById);
router.get('/by-user/:userID', getTicketsByUserId);
router.get('/by-schedule/:scheduleID', getTicketsByScheduleId);
// Cancel ticket
router.delete('/:ticketID', cancelTicket); 

export default router;
