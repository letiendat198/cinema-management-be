import mongoose from 'mongoose';
import { Order } from '../models/order.js'
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
    params['vnp_ReturnUrl'] = 'http://localhost:5173';
    // params['vnp_ExpireDate'] = dayjs().add(10, 'minute').format("YYYYMMDDHHmmss");
    params['vnp_TxnRef'] = orderID;
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

export const vnPayIPNHanle = async (req, res, next) => {
    const {vnp_TmnCode, vnp_ResponseCode, vnp_TransactionStatus, vnp_SecureHash} = req.query;

    res.status(200).json({
        RspCode: '00',
        Message: ''
    })
};