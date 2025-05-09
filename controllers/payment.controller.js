import mongoose from 'mongoose';
import { Order } from '../models/order.js'
import { Ticket } from '../models/ticket.js';
import { Schedule } from '../models/schedule.js'; 
import ErrorHandler from "../utils/errorHandler.js";
import dayjs from 'dayjs'
import crypto from 'crypto'
import querystring from 'qs'

export const getPayUrlForOrder = async (req, res, next) => {
  try {
    const clientIP = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
    console.log(`Client IP?: ${clientIP}`)
    const {orderID} = req.params;
    console.log(orderID);

    const order = await Order.findById(orderID);

    let payUrl = new URL("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html");
    let params = {}
    params["vnp_Version"] = "2.1.0";
    params["vnp_Command"] = "pay";
    params["vnp_TmnCode"] = process.env.VNPAY_TMN_CODE;
    params['vnp_Amount'] = order.totalPrice * 100;
    params['vnp_CreateDate'] = dayjs().format("YYYYMMDDHHmmss");
    params['vnp_CurrCode'] = 'VND';
    params['vnp_IpAddr'] = clientIP;
    params['vnp_Locale'] = 'vn';
    params['vnp_OrderInfo'] = `Thanh+toan+hoa+don+${orderID}`;
    params['vnp_OrderType'] = 'other';
    params['vnp_ReturnUrl'] = 'http://localhost:5173/verify-payment';
    // params['vnp_ExpireDate'] = dayjs().add(10, 'minute').format("YYYYMMDDHHmmss");
    params['vnp_TxnRef'] = orderID + '-' + dayjs().format("YYYYMMDDHHmmss"); // Avoid VNPay limit of 1 unique TxnRef per day
    // params['vnp_SecureHash'] = process.env.VNPAY_SECURE_HASH;

    params = Object.keys(params).sort().reduce((obj, key) => { 
        obj[key] = params[key]; 
        return obj;
    }, {});
    
    var signData = querystring.stringify(params, { encode: true });
    var hmac = crypto.createHmac("sha512", process.env.VNPAY_SECURE_HASH);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    params['vnp_SecureHash'] = signed;
    payUrl += '?' + querystring.stringify(params, { encode: true });

    res.status(200).json({
        success: true,
        data: payUrl
    })

  } catch (error) {
    next(error);
  }
};

export const vnPayIPNHandle = async (req, res, next) => {
    const {vnp_TxnRef, vnp_ResponseCode, vnp_TransactionStatus, vnp_SecureHash} = req.query;

    // TODO: Check hash

    if (vnp_TransactionStatus != '00') {
        return res.status(200).json({
                RspCode: '02',
                Message: error,
            })
    }

    let orderID = vnp_TxnRef.split("-")[0];

    try {
        if (!mongoose.Types.ObjectId.isValid(orderID)) {
            throw new Error("Invalid order ID");
        }

        const order = await Order.findById(orderID);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status !== 'pending') {
            throw new Error(`Order status is already ${order.status}`);
        }

        // payment verification logic here if possible


        const showtimeID = order.showtime; 
        const seatsToBook = order._tempSeats; 

        // Check if seats are still available
        const existingTickets = await Ticket.find({
            showtime: showtimeID,
            seatIndex: { $in: seatsToBook },
            status: { $in: ['booked'] } 
        });

        if (existingTickets.length > 0) {
            const bookedLabels = existingTickets.map(t => t.seatIndex);
            throw new Error(`Seats are no longer available: ${bookedLabels.join(', ')}`); // 409 Conflict
        }

        //Create Tickets
        const createdTickets = [];
        const schedule = await Schedule.findById(showtimeID); // For checkinDate
        if (!schedule) throw new Error("Showtime schedule not found");


        for (const seatIndex of seatsToBook) {
            const ticket = new Ticket({
                order: order._id,
                showtime: showtimeID,
                seatIndex: seatIndex,
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
        
        // Add movie to user's watch history 
        if (order.userID) {
            const movieID = schedule.movieID;
            await User.findByIdAndUpdate(
                order.userID,
                {
                    $push: { 
                        watchHistory: { 
                            movie: movieID,
                            date: new Date() 
                        }
                    }
                }
            );
        }

        res.status(200).json({
            RspCode: '00',
            Message: ''
        })

    } catch (error) {
        res.status(200).json({
            RspCode: '02',
            Message: error
        })
    }
};