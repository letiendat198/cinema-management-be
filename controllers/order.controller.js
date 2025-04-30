import { Order } from '../models/order.js';
import { Ticket } from '../models/ticket.js';
import { SeatType } from '../models/seattype.js';
import { ComplementItem } from '../models/complementitem.js';
import { Schedule } from '../models/schedule.js'; 
import { getRoomSeatLabelByIndex, SeatMap } from '../models/seatmap.js';
import ErrorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';
// Dont have discount
const calculateTotalPrice = async (seatsIndex, complementItemsData, seatMapData) => {
    let totalPrice = 0;

    // Calculate seat price
    for (const index of seatsIndex) {
        const seatType = await SeatType.findOne({value: seatMapData[index]});
        if (!seatType) throw new Error(`SeatType value ${seatMapData[index]} not found!`);
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
    try { // WARNING: Using seat label as ticket data may cause a problem if seat label is modified
        const { userID, showtime, seatsIndex, complementItems: complementItemsData } = req.body; // seatsIndex = [0,1,2,...], ...]

        if (!showtime || !seatsIndex || seatsIndex.length === 0) {
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
        const totalPrice = await calculateTotalPrice(seatsIndex, complementItemsData, seatMapData.valueMap);

        const orderData = {
            userID: userID,
            // We don't link tickets yet, only store seat info temporarily for confirmation
            _tempSeats: seatsIndex, // Temp for ticket
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
            seatIndex: { $in: seatsToBook.map(s => s.seatIndex) },
            status: { $in: ['booked'] } 
        });

        if (existingTickets.length > 0) {
            const bookedLabels = existingTickets.map(t => t.seatIndex);
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
                seatIndex: seat.seatIndex,
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
                path: 'complementItems.item',
                model: 'ComplementItem'
            })
            .sort({ createdAt: -1 }).lean(); // Lean to get rid of Mongoose 

        if (!orders || orders.length === 0) {
             res.status(200).json({ success: true, count: 0, data: [] });
             return;
        }

        for(let i=0;i<orders.length;i++) {
            let seats = orders[i]._tempSeats;
            let seatsLbl = Array(seats.length);
            let roomID = orders[i].showtime.roomID._id;
            for (let j=0;j<seats.length;j++) {
                seatsLbl[j] = await getRoomSeatLabelByIndex(roomID, seats[j]);
            };
            console.log(seatsLbl)
            orders[i].seatsLabel = seatsLbl;
        }
        console.log(orders)

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};