import { Order } from '../models/order.js';
import { Ticket } from '../models/ticket.js';
import { SeatType } from '../models/seattype.js';
import { ComplementItem } from '../models/complementitem.js';
import { Schedule } from '../models/schedule.js'; 
import ErrorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';
// Dont have discount
const calculateTotalPrice = async (seats, complementItemsData) => {
    let totalPrice = 0;

    // Calculate seat price
    for (const seat of seats) {
        const seatType = await SeatType.findById(seat.seattype);
        if (!seatType) throw new Error(`SeatType not found for ID: ${seat.seattype}`);
        totalPrice += seatType.price;
    }

    // Calculate complementary item price
    if (complementItemsData && complementItemsData.length > 0) {
        for (const itemData of complementItemsData) {
            const item = await ComplementItem.findById(itemData.item);
            if (!item) throw new Error(`ComplementItem not found for ID: ${itemData.item}`);
            totalPrice += item.price * itemData.quantity;
        }
    }

    return totalPrice;
};

// Pending order
export const createOrder = async (req, res, next) => {
    try {
        const { userID, showtimeID, seats, complementItems: complementItemsData } = req.body; // seats = [{ seatLabel: 'A1', seattype: 'VIP' }, ...]

        if (!showtimeID || !seats || seats.length === 0) {
            return next(new ErrorHandler("Showtime and at least one seat are required", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(showtimeID)) {
             return next(new ErrorHandler("Invalid showtime ID", 400));
        }
         if (userID && !mongoose.Types.ObjectId.isValid(userID)) {
             return next(new ErrorHandler("Invalid user ID", 400));
        }

      // Check for booked seat to ensure no error is in confirmOrder, shouldve been here

        const totalPrice = await calculateTotalPrice(seats, complementItemsData);

        const orderData = {
            userID: userID,
            // We don't link tickets yet, only store seat info temporarily for confirmation
            _tempSeats: seats, // Temp for ticket
            showtime: showtimeID, // Temp for ticket
            complementItems: complementItemsData || [],
            totalPrice,
            status: 'pending'
        };

        const order = new Order(orderData);
        await order.save();

        res.status(201).json({ success: true, data: order, message: 'Pending order created successfully' });

    } catch (error) {
        next(error);
    }
};

// Confirm a pending order and create tickets
export const confirmOrder = async (req, res, next) => {
    try {
        const { orderID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderID)) {
            return next(new ErrorHandler("Invalid order ID", 400));
        }

        const order = await Order.findById(orderID);

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }

        if (order.status !== 'pending') {
            return next(new ErrorHandler(`Order status is already ${order.status}`, 400));
        }

        // payment verification logic here if possible


        const showtimeID = order.showtime; 
        const seatsToBook = order._tempSeats; 

        // Check if seats are still available
        const existingTickets = await Ticket.find({
            showtime: showtimeID,
            seatLabel: { $in: seatsToBook.map(s => s.seatLabel) },
            status: { $in: ['booked'] } 
        });

        if (existingTickets.length > 0) {
            const bookedLabels = existingTickets.map(t => t.seatLabel);
            return next(new ErrorHandler(`Seats are no longer available: ${bookedLabels.join(', ')}`, 409)); // 409 Conflict
        }

        //Create Tickets
        const createdTickets = [];
        const schedule = await Schedule.findById(showtimeID); // For checkinDate
        if (!schedule) return next(new ErrorHandler("Showtime schedule not found", 404));


        for (const seat of seatsToBook) {
            const ticket = new Ticket({
                order: order._id,
                showtime: showtimeID,
                seattype: seat.seattype,
                seatLabel: seat.seatLabel,
                user: order.userID,
                status: 'booked',
                checkinDate: schedule.startTime 
            });
            await ticket.save();
            createdTickets.push(ticket._id);// Save id of every ticket created to stroe in order
        }

        //Update Order
        order.tickets = createdTickets;
        order.status = 'completed';
        order._tempSeats = undefined; // Remove temp data
        order.showtime = undefined; // Redundant data
        await order.save();
        // populate data for the respond order
        const confirmedOrder = await Order.findById(order._id)
            .populate('userID', 'username email')
            .populate({
                path: 'tickets',
                populate: { path: 'seattype' }
            })
            .populate({
                path: 'complementItems.item',
                model: 'ComplementItem'
            });


        res.status(200).json({ success: true, data: confirmedOrder, message: 'Order confirmed and tickets created successfully' });

    } catch (error) {
        next(error);
    }
};


export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('userID', 'username email') 
            .populate({
                path: 'tickets',
                populate: [
                    { path: 'showtime', populate: { path: 'movieID roomID' } }, 
                    { path: 'seattype' }
                ]
            })
            .populate({
                path: 'complementItems.item',
                model: 'ComplementItem' 
            })
            .sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

// Get a single order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const { orderID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderID)) {
        return next(new ErrorHandler("Invalid order ID", 400));
    }

    const order = await Order.findById(orderID)
        .populate('userID', 'username email')
        .populate({
            path: 'tickets',
            populate: [
                 { path: 'showtime', populate: { path: 'movieID roomID', populate: { path: 'cinemaID movieID' } } },
                 { path: 'seattype' }
            ]
        })
        .populate({
            path: 'complementItems.item',
            model: 'ComplementItem'
        });


    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Get orders by User ID, even pending one for user to continue purchase
export const getOrdersByUserId = async (req, res, next) => {
    try {
        const { userID } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return next(new ErrorHandler("Invalid user ID", 400));
        }

        const orders = await Order.find({ userID: userID })
            .populate('userID', 'username email')
             .populate({
                path: 'tickets',
                populate: [
                    { path: 'showtime', populate: { path: 'movieID roomID', populate: { path: 'cinemaID movieID' } } },
                    { path: 'seattype' }
                ]
            })
            .populate({
                path: 'complementItems.item',
                model: 'ComplementItem'
            })
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
             res.status(200).json({ success: true, count: 0, data: [] });
             return;
        }

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};