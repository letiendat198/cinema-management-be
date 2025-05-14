import { Ticket } from "../models/ticket.js"; // Correct import if model file is ticket.js
import ErrorHandler from "../utils/errorHandler.js"; // Assuming you have this
import mongoose from 'mongoose';
import { Schedule } from "../models/schedule.js";
import { getRoomSeatLabelByIndex } from "../models/seatmap.js";
export const getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find()
            .populate({ path: 'order', select: 'userID status' }) 
            .populate({ path: 'showtime', populate: { path: 'movieID roomID' } })
            .populate('seattype') 
            .populate('user', 'username email').lean();


        // Inject seat labels
        for(let i=0;i<tickets.length;i++) {
            let roomID = tickets[i].showtime.roomID._id;
            tickets[i].seatLabel = await getRoomSeatLabelByIndex(roomID, tickets[i].seatIndex);
        }

        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        next(error);
    }
};

// Get tickets by User ID
export const getTicketsByUserId = async (req, res, next) => { 
    try {
        const { userID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return next(new ErrorHandler("Invalid user ID", 400));
        }

        const tickets = await Ticket.find({ user: userID }) 
            .populate({
                path: "showtime", 
                populate: [ 
                    { path: 'movieID', select: 'title img' }, 
                    { path: 'roomID', select: '_id roomNumber cinemaID', populate: { path: 'cinemaID', select: 'name location' } }
                ]
            })
            .populate('order', 'status totalPrice')
            .populate('seat') 
            .sort({ createdAt: -1 }).lean(); 

        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        next(error);
    }
};

// Get tickets by Schedule ID
export const getTicketsByScheduleId = async (req, res, next) => { 
    try {
        const { scheduleID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(scheduleID)) {
            return next(new ErrorHandler("Invalid schedule ID", 400));
        }

        const tickets = await Ticket.find({ showtime: scheduleID }) 
            .populate({
                path: "showtime", 
                populate: [ 
                    { path: 'movieID', select: 'title img' }, 
                    { path: 'roomID', select: '_id roomNumber cinemaID', populate: { path: 'cinemaID', select: 'name location' } }
                ]
            })
            .populate('order', 'status totalPrice') 
            .populate('seat')
            .sort({ createdAt: -1 }).lean(); 

        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        next(error);
    }
};

export const getTicketById = async (req, res, next) => {
    try {
        const { ticketID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(ticketID)) {
            return next(new ErrorHandler("Invalid ticket ID", 400));
        }

        const ticket = await Ticket.findById(ticketID)
            .populate({ path: 'order', select: 'userID status' })
            .populate({ path: 'showtime', populate: { path: 'movieID roomID' } })
            .populate('seattype')
            .populate('user', 'username email');

        if (!ticket) {
            return next(new ErrorHandler("Ticket not found", 404));
        }

        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
};

//set status to cancelled
export const cancelTicket = async (req, res, next) => {
    try {
        const { ticketID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(ticketID)) {
            return next(new ErrorHandler("Invalid ticket ID", 400));
        }

        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            return next(new ErrorHandler("Ticket not found", 404));
        }

        // check if cancellation is allowed (before showtime?)
        if (ticket.status === 'expired' || ticket.status === 'cancelled') {
           return next(new ErrorHandler(`Ticket cannot be cancelled (status: ${ticket.status})`, 400));
        }
        const showtime = await Schedule.findById(ticket.showtime);
        if (new Date() >= showtime.startTime) {
           return next(new ErrorHandler('Cannot cancel ticket after showtime has started', 400));
        }

        ticket.status = 'cancelled';
        await ticket.save();

        // Update related order status if all tickets are cancelled needed

        res.status(200).json({ success: true, message: 'Ticket cancelled successfully', data: ticket });
    } catch (error) {
        next(error);
    }
};


