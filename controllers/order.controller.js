import { Order } from '../models/order.js';
import { Ticket } from '../models/ticket.js';
import { Seat } from '../models/seat.js';
import { ComplementItem } from '../models/complementitem.js';
import { User } from '../models/user.js';
import { Schedule } from '../models/schedule.js'; 
import { getRoomSeatLabelByIndex, SeatMap } from '../models/seatmap.js';
import ErrorHandler from '../utils/errorHandler.js';
import mongoose, { model } from 'mongoose';
// Dont have discount
const calculateTotalPrice = async (seatsID, complementItemsData) => {
    let totalPrice = 0;

    // Calculate seat price
    for (const seatID of seatsID) {
        const seat = await Seat.findById(seatID).populate("seatType");
        if (!seat) throw new Error(`Seat id ${seatID} not found!`);
        
        totalPrice += seat.seatType.price;
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
    try { // WARNING: Using seat label as ticket data may cause a problem if seat label is modified
        const { userID, showtime, seatsID, complementItems: complementItemsData } = req.body; // seatsID = [0,1,2,...], ...]

        if (!showtime || !seatsID || seatsID.length === 0) {
            return next(new ErrorHandler("Showtime and at least one seat are required", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(showtime)) {
             return next(new ErrorHandler("Invalid showtime ID", 400));
        }
         if (userID && !mongoose.Types.ObjectId.isValid(userID)) {
             return next(new ErrorHandler("Invalid user ID", 400));
        }

      // Check for booked seat to ensure no error is in confirmOrder, shouldve been here
        const schedule = await Schedule.findById(showtime);
        const seatMapData = await SeatMap.findOne({roomID: schedule.roomID});
        const totalPrice = await calculateTotalPrice(seatsID, complementItemsData, seatMapData.valueMap);

        const orderData = {
            userID: userID,
            // We don't link tickets yet, only store seat info temporarily for confirmation
            _tempSeats: seatsID, // Temp for ticket
            showtime: showtime, // Temp for ticket
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

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('userID', 'username email') 
            .populate({
                path: 'tickets',
                populate: [
                    { path: 'showtime', populate: { path: 'movieID roomID' } }, 
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
            // .populate('userID', 'username email')
            .populate({
                path: 'tickets',
                populate: {
                    path: 'seat',
                    model: 'Seat'
                },
                model: 'Ticket'
            })
             .populate({ 
                path: 'showtime', 
                populate: [{ 
                    path: 'roomID', 
                    model: 'Room',
                    populate: { 
                        path: 'cinemaID',
                        model: 'Cinema' 
                    }
                },
                {
                    path: 'movieID',
                    model: 'Movie'
                }]
            })
            .populate({
                path: '_tempSeats',
                model: 'Seat'
            })
            .populate({
                path: 'complementItems.item',
                model: 'ComplementItem'
            })
            .sort({ createdAt: -1 }).lean(); // Lean to get rid of Mongoose 

        if (!orders || orders.length === 0) {
             res.status(200).json({ success: true, count: 0, data: [] });
             return;
        }

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};